const content = document.getElementById("content");

const tierPoints = {
    HT1: 10,
    LT1: 9,
    HT2: 8,
    LT2: 7,
    HT3: 6,
    LT3: 5,
    HT4: 4,
    LT4: 3,
    HT5: 2,
    LT5: 1,

    RHT1: 10,
    RLT1: 9,
    RHT2: 8,
    RLT2: 7,
    RHT3: 6,
    RLT3: 5,
    RHT4: 4,
    RLT4: 3,
    RHT5: 2,
    RLT5: 1
};

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

    if (players.length === 0) {
        card.innerHTML += "<p>No players added yet.</p>";
    }

    players.forEach(player => {
        const div = document.createElement("div");
        div.className = "player";

        let gamemodes = "";

        for (const mode in player.rankings) {
            gamemodes += `
                <div>
                    ${mode.toUpperCase()}: ${player.rankings[mode]}
                </div>
            `;
        }

        div.innerHTML = `
            <div>
                <div style="font-size: 1.2rem; font-weight: bold;">
                    ${player.name}
                </div>

                ${gamemodes}
            </div>

            <div class="points">
                ${calculatePoints(player)} Points
            </div>
        `;

        card.appendChild(div);
    });

    content.appendChild(card);
}

function showGamemodes() {
    const players = getPlayers();

    content.innerHTML = "";

    const modes = [
        "sword",
        "axe",
        "mace",
        "uhc",
        "nethpot",
        "pot",
        "smp",
        "crystal",
        "spearmace"
    ];

    modes.forEach(mode => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `<h2>${mode.toUpperCase()}</h2>`;

        const rankedPlayers = players.filter(player =>
            player.rankings &&
            player.rankings[mode]
        );

        if (rankedPlayers.length === 0) {
            card.innerHTML += "<p>No ranked players.</p>";
        }

        rankedPlayers.forEach(player => {
            const div = document.createElement("div");
            div.className = "player";

            div.innerHTML = `
                <span>${player.name}</span>
                <span class="tier">
                    ${player.rankings[mode]}
                </span>
            `;

            card.appendChild(div);
        });

        content.appendChild(card);
    });
}

showOverall();
