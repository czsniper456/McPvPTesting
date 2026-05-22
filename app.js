const tierPoints = {
    HT1: 10, LT1: 9, HT2: 8, LT2: 7, HT3: 6, LT3: 5,
    HT4: 4, LT4: 3, HT5: 2, LT5: 1,
    RHT1: 10, RLT1: 9, RHT2: 8, RLT2: 7, RHT3: 6, RLT3: 5,
    RHT4: 4, RLT4: 3, RHT5: 2, RLT5: 1
}; // ← THIS WAS MISSING

// Get the main content container
const content = document.getElementById("content");

// Load players from localStorage
function getPlayers() {
    return JSON.parse(localStorage.getItem("mcpvp_players")) || [];
}

// Calculate total points for a player
function calculatePoints(player) {
    let total = 0;
    if (!player.rankings) return total;

    for (const mode in player.rankings) {
        total += tierPoints[player.rankings[mode]] || 0;
    }
    return total;
}

// Display the leaderboard with sorting + bubbles
function showOverall() {
    const players = getPlayers();

    // SORT PLAYERS BY POINTS (highest → lowest)
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

// Load leaderboard on page open
showOverall();
