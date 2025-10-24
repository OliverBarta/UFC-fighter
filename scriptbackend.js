async function readfile() {
    const response = await fetch("fighters.json");
    const data = await response.json();
    return data;
}
async function predict(keyp) {
    const suggestionsDiv = document.getElementById("suggestions");

    const data = await readfile();
    
    const search = keyp.toLowerCase();

    const matches = data.filter(f => f.name?.toLowerCase().startsWith(search));

    if (matches.length > 0) {
        // just show the first few names
        const names = matches.slice(0, 4).map(f => f.name);
        //alert("Suggestions:\n" + names);
        suggestionsDiv.style.display = "flex";
        let html2 = '<table>'
        for (let i = 0; i<names.length; i+=2) {
            html2 += '<tr><td>'+names[i]+'</td><td>'+' '+names[i+1]+'</td></tr>';
        }

        html2 += '</table>'
        suggestionsDiv.innerHTML = html2;
        alert(names);
    } else {
        suggestionsDiv.style.display = "flex";
        suggestionsDiv.innerHTML = ("Suggestions:\n None");
        //alert("No matches found.");
    }


}


document.getElementById("fightersearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchFighter();
    }

    const keyp = event.key;
    
    predict(keyp);

});

async function searchFighter() {
    const fighterName = document.getElementById("fightersearch").value.trim().toLowerCase();
    const resultDiv = document.getElementById("result");

    if (fighterName === "") {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "Please enter a fighter name.";
        return;
    }

    const data = await readfile();

    // Match by lowercase JSON field "name"
    const fighter = data.find(f => f.name?.toLowerCase() === fighterName);

    resultDiv.style.display = "block";

    if (fighter) {
        
        let html = `<h2>${fighter.name}</h2><table>`;
        for (const [key, value] of Object.entries(fighter)) {
            if (key != "name") {
                html += `<tr><td><strong>${key}: </strong></td><td>${value}</td></tr>`;
            }
            
        }
        html += `</table>`;
        resultDiv.innerHTML = html;
    } else {
        resultDiv.innerHTML = "Fighter not found.";
    }
}