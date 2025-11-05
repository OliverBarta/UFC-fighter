async function readfile() {
    const response = await fetch("fighters.json");
    const data = await response.json();
    return data;
}

async function fadeInElement(el) {
    el.classList.remove("fade-out");
    el.style.display = "flex"; // or "block" if needed
    void el.offsetWidth; // restart animation
    el.classList.add("fade-in");
}

async function fadeOutElement(el) {
    el.classList.remove("fade-in");
    el.classList.add("fade-out");
    el.addEventListener("animationend", function handler() {
        el.style.display = "none";
        el.removeEventListener("animationend", handler);
    });
}

async function predict(name) {

    const suggestionsDiv = document.getElementById("suggestions");

    const data = await readfile();
    
    const search = name.toLowerCase();


    if (search.length<9) {
        suggestionsDiv.style.setProperty("--p3",(90-search.length*10)+'%');
        
    }

    const matches = data.filter(f => f.name?.toLowerCase().startsWith(search));
    
    while (suggestionsDiv.firstChild) {
        suggestionsDiv.removeChild(suggestionsDiv.firstChild);
    }
    
    if (suggestionsDiv.style.display == "none") {
        fadeInElement(suggestionsDiv);
    }
    if (matches.length > 0) {
        // just the first 6 names
        const names = matches.slice(0, 6).map(f => f.name);
        
        
        for (let i = 0; i<names.length; i++) {
            let button = document.createElement('button');
            button.innerHTML = names[i];
            button.onclick = function() {
                searchFighter(names[i].trim());
            };
            suggestionsDiv.appendChild(button);
        }
        
    } else {
        let textnosuggest = document.createElement('p');
        textnosuggest.innerHTML = "Suggestions: None";
        suggestionsDiv.appendChild(textnosuggest);
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

//for the search button
async function searchFighterNoName() {
    searchFighter(document.getElementById("fightersearch").value.trim());
}

async function searchFighter(fighterName) {
    fighterName = fighterName.toLowerCase();
    const nameEleDiv = document.getElementById("nameEle");
    const resultDiv = document.getElementById("result");
    const bartext = document.getElementById("bartext");
    const barwins = document.getElementById("barwins");
    const barwinside = document.getElementById("barwinside");
    const barloseside = document.getElementById("barloseside");
    const bardrawside = document.getElementById("bardrawside");


    const suggestionsDiv = document.getElementById("suggestions");

    if (fighterName === "") {
        resultDiv.style.display = "flex";
        resultDiv.innerHTML = "Please enter a fighter name.";
        return;
    }

    const data = await readfile();

    // Match by lowercase JSON field "name"
    const fighter = data.find(f => f.name?.toLowerCase() === fighterName);
    
    fadeInElement(resultDiv);
    fadeInElement(bartext);
    fadeInElement(barwins);
    fadeInElement(nameEleDiv);
    
    

    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }
    while (nameEleDiv.firstChild) {
        nameEleDiv.removeChild(nameEleDiv.firstChild);
    }

    if (fighter) {
        for (const [key, value] of Object.entries(fighter)) {
            if (key == "name") {
                let nameEle = document.createElement('h1');
                nameEle.innerHTML = value;
                nameEleDiv.appendChild(nameEle);
            } else if (key == "wins") {
                var win = Number(value);
            } else if (key == "losses") {
                var losses = Number(value);
            } else if (key == "draws") {
                var draws = Number(value);
            } else if (key == "nickname") {
                let fighterStats = document.createElement('h2');
                fighterStats.innerHTML = "AKA: "+value;
                resultDiv.appendChild(fighterStats);
            } else {
                let fighterStats = document.createElement('p');
                if (value != "") {
                    fighterStats.innerHTML = key+": "+value;
                } else {
                    fighterStats.innerHTML = key+": NA";
                }
                resultDiv.appendChild(fighterStats);
            }
        }
        
        
        bartext.innerHTML = "Wins: "+win+" Draws: "+draws+" Losses: "+losses;


        barwinside.style.width = ((win/(win+draws+losses))*100)+'%';
        bardrawside.style.width = ((draws/(win+draws+losses))*100)+'%';
        barloseside.style.width = ((losses/(win+draws+losses))*100)+'%';
        resultDiv.style.setProperty("--p1", ((((win+draws)/(win+draws+losses))*100)/2)+'%');
        resultDiv.style.setProperty("--p2", (100-(((losses+draws)/(win+draws+losses))*100))+'%');

    } else {
        resultDiv.innerHTML = "Fighter not found.";
    }
}