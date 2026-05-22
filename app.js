const tierPoints = {
    HT1: 10, LT1: 9, HT2: 8, LT2: 7, HT3: 6, LT3: 5,
    HT4: 4, LT4: 3, HT5: 2, LT5: 1,
    RHT1: 10, RLT1: 9, RHT2: 8, RLT2: 7, RHT3: 6, RLT3: 5,
    RHT4: 4, RLT4: 3, RHT5: 2, RLT5: 1
};

const content = document.getElementById("content");

let currentFilter = "all";
let searchQuery = "";

function getPlayers() {
    return JSON.parse(localStorage.getItem("mcpvp_players")) || [];
}

function calculatePoints(player) {
    let total = 0;
    if (!player.rankings) return total;

    for (const mode in player.rankings) {
        total += tierPoints[player.rankings[mode]] || 0;
    }
    return total;
}

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

    // Title changes depending on filter
    if (currentFilter === "all") {
        card.innerHTML = "<h2>Overall Rankings</h2>";
    } else {
        card.innerHTML = `<h2>${currentFilter.toUpperCase()} Rankings</h2>`;
    }

    players.forEach(player => {
        const bubble = document.createElement("div");
        bubble.className = "player-bubble";

        let modesHTML = "";

        // If filtering by a specific gamemode → show ONLY that mode
        if (currentFilter !== "all") {
            const tier = player.rankings[currentFilter];
            modesHTML = `<div class="mode">${currentFilter.toUpperCase()}: ${tier}</div>`;
        } else {
            // Show all modes
            for (const mode in player.rankings) {
                modesHTML += `<div class="mode">${mode.toUpperCase()}: ${player.rankings[mode]}</div>`;
            }
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

showOverall();
