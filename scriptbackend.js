document.getElementById("fightersearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchFighter();
    }
});

function searchFighter() {
    const fighterName = document.getElementById("fightersearch").value.trim();
    const resultDiv = document.getElementById("result");

    if (fighterName === "") {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "Please enter a fighter name.";
        return;
    }



    resultDiv.style.display = "block";
    resultDiv.innerHTML = fighterName;
}