async function readfile() {
    const response = await fetch("fighters.json");
    const data = await response.json();
    return data;
}

function expandSuggestions(el) {
    el.style.display = "flex";   // MUST be visible first
    el.offsetHeight;
    el.classList.remove("collapse");
    el.classList.add("expand");
}

function collapseSuggestions(el) {
    el.classList.remove("expand");
    el.classList.add("collapse");

    el.addEventListener("transitionend", function handler(e) {
        if (e.propertyName === "max-height") {
            el.style.display = "none";
            el.removeEventListener("transitionend", handler);
        }
    });
}


var showFighters = false;
let fightersOn = 0;
var comparisonMode = false;



function getResponsiveWidth() {
    if (fightersOn > 1) {
        return '90%';
    }
    // If screen width is small, use 90%, otherwise 50%
    return window.innerWidth <= 768 ? '95%' : '50%';
}

async function fadeInElement(el) {
    el.classList.remove("fade-out");
    el.classList.remove("shrink-out");
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

async function predict(name, numFighters) {

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
    
    if (getComputedStyle(suggestionsDiv).display === "none") {
        expandSuggestions(suggestionsDiv);
    }

    if (showFighters) {
        let button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = "Hide extra \""+name+"\"";
        button.style.backgroundImage = 'linear-gradient(to right, black, rgb(128,128,205))';
        button.style.borderRadius = '4px';
        button.style.width = '40%';
        button.style.textAlign = 'center';
        button.style.alignSelf = 'center';
        button.onclick = function() {
            predict(name, 6);
            showFighters = false;
        }
        suggestionsDiv.appendChild(button);
    }

    if (matches.length > 0) {

        const names = matches.slice(0, numFighters).map(f => f.name);
        

        for (let i = 0; i < names.length; i++) {

            // row wrapper
            const row = document.createElement('div');
            row.classList.add('suggestion-row');
        
            // name button
            const button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = names[i];
            button.onclick = function () {
                if (fightersOn == 0) {
                    fightersOn = 1;
                }
                predict(name, numFighters);
                searchFighter(names[i].trim());
            };
            

            let compareButton;

            if (fightersOn >= 1) {
                // compare button
                compareButton = document.createElement('button');
                compareButton.type = 'button';
                compareButton.innerHTML = 'Compare';
                compareButton.classList.add('compare');
                compareButton.onclick = function () {
                    collapseSuggestions(suggestionsDiv);
                    compareFighter(names[i].trim());
                    fightersOn = 2;
                };
            }


            row.appendChild(button);
            if (fightersOn >= 1) {
                row.appendChild(compareButton);
            }
            suggestionsDiv.appendChild(row);
        }        

        if (showFighters) {
            let button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = "Hide extra \""+name+"\"";
            button.style.backgroundImage = 'linear-gradient(to right, black, rgb(128,128,205))';
            button.style.borderRadius = '4px';
            button.style.width = '40%';
            button.style.textAlign = 'center';
            button.style.alignSelf = 'center';
            button.onclick = function() {
                predict(name, 6);
                showFighters = false;
            }
            suggestionsDiv.appendChild(button);
        }

        if (matches.length > 6 && !showFighters) {
            let button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = "Show all \""+name+"\"";
            button.style.backgroundImage = 'linear-gradient(to right, black, rgb(128,128,205))';
            button.style.borderRadius = '4px';
            button.style.width = '40%';
            button.style.textAlign = 'center';
            button.style.alignSelf = 'center';
            button.onclick = function() {
                predict(name, 4200);
                showFighters = true;
            }
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
    if (showFighters) {
        predict(name, 4200);
    } else {
        predict(name, 6);
    }
});

//for the search button
async function searchFighterNoName() {
    searchFighter(document.getElementById("fightersearch").value.trim());
}

async function firstanimat(el, widthyn) {
    el.style.filter = 'blur(4px)';
    el.style.opacity = '0.5';
    if (widthyn) {
        el.style.width = '10%';
    }
}

async function secondanimat(el, widthyn) {
    if (widthyn) {
        el.style.width = getResponsiveWidth();
    }
    el.style.filter = 'blur(0px)';
    el.style.opacity = '1';
}

async function animateResultDiv(resultDivEl, barwinsEl, bartextEl, nameEleDivEl) {
    firstanimat(resultDivEl, true);
    firstanimat(barwinsEl, true);
    firstanimat(bartextEl, false);
    firstanimat(nameEleDivEl, false);
    
    //delays
    await new Promise(resolve => setTimeout(resolve, 300));
    secondanimat(resultDivEl, true);
    secondanimat(barwinsEl, true);
    secondanimat(bartextEl, false);
    secondanimat(nameEleDivEl, false);

}

async function findLargest(stat) {
    const data = await readfile();
    var largest = 0;
    for (let i = 0; i < data.length; i++) {
        if (Number(data[i][stat]) > largest) {
            largest = Number(data[i][stat]);
        }
    }
    return largest;
}

async function sumOf(stat) {
    const data = await readfile();
    var total = 0;
    for (let i = 0; i < data.length; i++) {
        total += Number(data[i][stat]);
    }
    
    return total;
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

 
    //has to use await for the async functions
    const data = await readfile();

    // Match by lowercase JSON field "name"
    const fighter = data.find(f => f.name?.toLowerCase() === fighterName);
    
    const sumSSLPM = await sumOf("significant_strikes_landed_per_minute");


    if (fighterName === "") {
        bartext.style.display = 'none';
        barwins.style.display = 'none';
        nameEleDiv.style.display = 'none';

        resultDiv.style.display = "flex";
        resultDiv.style.marginTop = '5%';
        resultDiv.style.height = '70px';

        resultDiv.innerHTML = "Please enter a fighter name.";

        await animateResultDiv(resultDiv, barwins, bartext, nameEleDiv);
        return;
    }

    if (fighter) {
        resultDiv.style.height = 'auto';
    }

    //Animate blur result change
    await animateResultDiv(resultDiv, barwins, bartext, nameEleDiv);

    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }
    while (nameEleDiv.firstChild) {
        nameEleDiv.removeChild(nameEleDiv.firstChild);
    }

    fadeInElement(resultDiv);
    if (fighter) {
        fadeInElement(bartext);
        fadeInElement(barwins);
        fadeInElement(nameEleDiv);
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
                if (value != "") {
                    fighterStats.innerHTML = "AKA: "+value;
                } else {
                    fighterStats.innerHTML = "AKA: NA";
                }
                resultDiv.appendChild(fighterStats);
            } else if (key == "image") {
                const img = document.createElement("img");
                if (value != "") {
                    img.src = fighter.image;
                } else {
                    img.src = "images/defaultPFP.png";
                }
                img.alt = fighter.name;
                img.className = "fighter-image";
                resultDiv.appendChild(img);
            } else if (!["stance","date_of_birth"].includes(key)) {
                let boxblue2 = document.createElement("div");
                let new_key = key[0].toUpperCase()+key.slice(1); //Captializes first letter
                boxblue2.classList.add("bargreen");
                if (value != "") {
                    boxblue2.innerHTML = new_key.replace(/_/g," ")+": "+value;
                } else {
                    boxblue2.innerHTML = new_key.replace(/_/g," ")+": NA";
                }
                largestVal = await findLargest(key);
                boxblue2.style.setProperty("--p1", (Math.round(value/largestVal*100))+'%');

                resultDiv.appendChild(boxblue2);

            } else {
                let fighterStats = document.createElement('div');
                fighterStats.classList.add("resultText");
                let new_key = key[0].toUpperCase()+key.slice(1); //Captializes first letter
                if (value != "") {
                    fighterStats.innerHTML = new_key.replace(/_/g," ")+": "+value;
                } else {
                    fighterStats.innerHTML = new_key.replace(/_/g," ")+": NA";
                }
                resultDiv.appendChild(fighterStats);
            }
        }

        resultDiv.style.marginTop = '0%';
        bartext.innerHTML = "Wins: "+win+" Draws: "+draws+" Losses: "+losses;
        barwinside.style.width = ((win/(win+draws+losses))*100)+'%';
        bardrawside.style.width = ((draws/(win+draws+losses))*100)+'%';
        barloseside.style.width = ((losses/(win+draws+losses))*100)+'%';
        resultDiv.style.setProperty("--p1", ((((win+draws)/(win+draws+losses))*100)/2)+'%');
        resultDiv.style.setProperty("--p2", (100-(((losses+draws)/(win+draws+losses))*100))+'%');
    } else {
        bartext.style.display = 'none';
        barwins.style.display = 'none';
        nameEleDiv.style.display = 'none';

        resultDiv.innerHTML = "Fighter not found.";
        resultDiv.style.marginTop = '5%';
        resultDiv.style.height = '70px';

    }
    // alert(Math.round(fighter.significant_strikes_landed_per_minute/largestSSLPM*100));
}


async function compareFighter(fighterName) {
    fighterName = fighterName.toLowerCase();

    const nameEleDiv = document.getElementById("nameEle");
    const resultDiv = document.getElementById("result");
    const bartext = document.getElementById("bartext");
    const barwins = document.getElementById("barwins");

    if (!comparisonMode) {
        await animateResultDiv(resultDiv, barwins, bartext, nameEleDiv);
        comparisonMode = true;
    }



    const nameEleDiv2 = document.getElementById("nameEle2");
    const resultDiv2 = document.getElementById("result2");
    const bartext2 = document.getElementById("bartext2");
    const barwins2 = document.getElementById("barwins2");
    const barwinside2 = document.getElementById("barwinside2");
    const barloseside2 = document.getElementById("barloseside2");
    const bardrawside2 = document.getElementById("bardrawside2");
    const fighterCol2 = document.getElementById("fighter-column2");

    fadeInElement(fighterCol2);

    //has to use await for the async functions
    const data = await readfile();

    // Match by lowercase JSON field "name"
    const fighter = data.find(f => f.name?.toLowerCase() === fighterName);
    
    const sumSSLPM = await sumOf("significant_strikes_landed_per_minute");
    const largestSSLPM = await findLargest("significant_strikes_landed_per_minute");

    if (fighterName === "") {
        bartext2.style.display = 'none';
        barwins2.style.display = 'none';
        nameEleDiv2.style.display = 'none';

        resultDiv2.style.display = "flex";
        resultDiv2.style.marginTop = '5%';
        resultDiv2.style.height = '70px';

        resultDiv2.innerHTML = "Please enter a fighter name.";

        await animateResultDiv(resultDiv2, barwins2, bartext2, nameEleDiv2);
        return;
    }

    if (fighter) {
        resultDiv2.style.height = 'auto';
    }

    //Animate blur result change
    await animateResultDiv(resultDiv2, barwins2, bartext2, nameEleDiv2);

    while (resultDiv2.firstChild) {
        resultDiv2.removeChild(resultDiv2.firstChild);
    }
    while (nameEleDiv2.firstChild) {
        nameEleDiv2.removeChild(nameEleDiv2.firstChild);
    }

    fadeInElement(resultDiv2);
    if (fighter) {
        fadeInElement(bartext2);
        fadeInElement(barwins2);
        fadeInElement(nameEleDiv2);
    }

    if (fighter) {
        for (const [key, value] of Object.entries(fighter)) {
            if (key == "name") {
                let nameEle = document.createElement('h1');
                nameEle.innerHTML = value;
                nameEleDiv2.appendChild(nameEle);
            } else if (key == "wins") {
                var win = Number(value);
            } else if (key == "losses") {
                var losses = Number(value);
            } else if (key == "draws") {
                var draws = Number(value);
            } else if (key == "nickname") {
                let fighterStats = document.createElement('h2');
                if (value != "") {
                    fighterStats.innerHTML = "AKA: "+value;
                } else {
                    fighterStats.innerHTML = "AKA: NA";
                }
                resultDiv2.appendChild(fighterStats);
            } else if (key == "image") {
                const img = document.createElement("img");
                if (value != "") {
                    img.src = fighter.image;
                } else {
                    img.src = "images/defaultPFP.png";
                }
                img.alt = fighter.name;
                img.className = "fighter-image";
                resultDiv2.appendChild(img);
            } else if (!["stance","date_of_birth"].includes(key)) {
                let boxblue2 = document.createElement("div");
                let new_key = key[0].toUpperCase()+key.slice(1); //Captializes first letter
                boxblue2.classList.add("bargreen");
                if (value != "") {
                    boxblue2.innerHTML = new_key.replace(/_/g," ")+": "+value;
                } else {
                    boxblue2.innerHTML = new_key.replace(/_/g," ")+": NA";
                }
                largestVal = await findLargest(key);
                boxblue2.style.setProperty("--p1", (Math.round(value/largestVal*100))+'%');
                resultDiv2.appendChild(boxblue2);
            } else {
                let fighterStats = document.createElement('div');
                fighterStats.classList.add("resultText");
                let new_key = key[0].toUpperCase()+key.slice(1); //Captializes first letter
                if (value != "") {
                    fighterStats.innerHTML = new_key.replace(/_/g," ")+": "+value;
                } else {
                    fighterStats.innerHTML = new_key.replace(/_/g," ")+": NA";
                }
                resultDiv2.appendChild(fighterStats);
            }
        }

        resultDiv2.style.marginTop = '0%';
        bartext2.innerHTML = "Wins: "+win+" Draws: "+draws+" Losses: "+losses;
        barwinside2.style.width = ((win/(win+draws+losses))*100)+'%';
        bardrawside2.style.width = ((draws/(win+draws+losses))*100)+'%';
        barloseside2.style.width = ((losses/(win+draws+losses))*100)+'%';
        resultDiv2.style.setProperty("--p1", ((((win+draws)/(win+draws+losses))*100)/2)+'%');
        resultDiv2.style.setProperty("--p2", (100-(((losses+draws)/(win+draws+losses))*100))+'%');
    } else {
        bartext2.style.display = 'none';
        barwins2.style.display = 'none';
        nameEleDiv2.style.display = 'none';

        resultDiv2.innerHTML = "Fighter not found.";
        resultDiv2.style.marginTop = '5%';
        resultDiv2.style.height = '70px';

    }

}