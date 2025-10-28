async function readfile() {
    const response = await fetch("fighters.json");
    const data = await response.json();
    return data;
}
async function predict(name) {
    const suggestionsDiv = document.getElementById("suggestions");

    const data = await readfile();
    
    const search = name.toLowerCase();
    
    const matches = data.filter(f => f.name?.toLowerCase().startsWith(search));
    while (suggestionsDiv.firstChild) {
        suggestionsDiv.removeChild(suggestionsDiv.firstChild);
    }
    
    if (matches.length > 0) {
        // just the first 6 names
        const names = matches.slice(0, 6).map(f => f.name);
        //alert("Suggestions:\n" + names);
        suggestionsDiv.style.display = "flex";
        
        for (let i = 0; i<names.length; i++) {
            let button = document.createElement('button');
            button.innerHTML = names[i];
            button.onclick = function() {
                searchFighter(names[i].trim());
            };
            suggestionsDiv.appendChild(button);
        }
        
        //alert(names);
    } else {
        suggestionsDiv.style.display = "flex";
        let textnosuggest = document.createElement('p');
        textnosuggest.innerHTML = "Suggestions: None";
        suggestionsDiv.appendChild(textnosuggest);
        //alert("No matches found.");
    }


}

document.getElementById("fightersearch").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchFighter(document.getElementById("fightersearch").value.trim());
    }
    
    console.log(event.key);

    //const prevkeys = keypArray;
    const name = document.getElementById("fightersearch").value.trim();
    console.log("name:",name);
    predict(name);

});

async function searchFighter(fighterName) {
    //const fighterName = document.getElementById("fightersearch").value.trim().toLowerCase();
    fighterName = fighterName.toLowerCase();
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