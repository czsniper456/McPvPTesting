const content = document.getElementById("content");

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

function showOverall() {
    const players = getPlayers();
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

showOverall();
