const content = document.getElementById("content");

function calculatePoints(player) {
    let total = 0;

    for (const mode in player.rankings) {
        total += tierPoints[player.rankings[mode]] || 0;
    }

    return total;
}

function showOverall() {
    content.innerHTML = "";

    const sorted = [...players].sort((a, b) => calculatePoints(b) - calculatePoints(a));

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <h2>Overall Rankings</h2>
    `;

    sorted.forEach(player => {
        const div = document.createElement("div");
        div.className = "player";

        div.innerHTML = `
            <span>${player.name}</span>
            <span class="points">${calculatePoints(player)} Points</span>
        `;

        card.appendChild(div);
    });

    content.appendChild(card);
}

function showGamemodes() {
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

        const sorted = [...players].sort((a, b) => {
            return tierPoints[b.rankings[mode]] - tierPoints[a.rankings[mode]];
        });

        sorted.forEach(player => {
            const div = document.createElement("div");
            div.className = "player";

            div.innerHTML = `
                <span>${player.name}</span>
                <span class="tier">${player.rankings[mode]}</span>
            `;

            card.appendChild(div);
        });

        content.appendChild(card);
    });
}

showOverall();
