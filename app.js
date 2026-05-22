let currentFilter = "all";
let searchQuery = "";

function filterMode(mode) {
    currentFilter = mode;
    showOverall();
}

document.getElementById("searchBar").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    showOverall();
});

function showOverall() {
    let players = getPlayers();

    // SEARCH FILTER
    if (searchQuery.trim() !== "") {
        players = players.filter(p =>
            p.name.toLowerCase().includes(searchQuery)
        );
    }

    // GAMEMODE FILTER
    if (currentFilter !== "all") {
        players = players.filter(p =>
            p.rankings && p.rankings[currentFilter]
        );
    }

    // SORT BY POINTS
    players.sort((a, b) => calculatePoints(b) - calculatePoints(a));

    content.innerHTML = "";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = "<h2>Overall Rankings</h2>";

    players.forEach(player => {
        const bubble = document.createElement("div");
        bubble.className = "player-bubble";

        let modesHTML = "";
        for (const mode in player.rankings) {
            modesHTML += `<div class="mode">${mode.toUpperCase()}: ${player.rankings[mode]}</div>`;
        }

        bubble.innerHTML = `
            <div class="player-left">
                <div class="player-name">${player.name}</div>
                <div class="player-modes">${modesHTML}</div>
            </div>
            <div class="player-points">${calculatePoints(player)} Points</div>
        `;

        card.appendChild(bubble);
    });

    content.appendChild(card);
}
