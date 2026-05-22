const content = document.getElementById("content");

    content.innerHTML = "";

    const sorted = [...players].sort((a, b) => calculatePoints(b) - calculatePoints(a));

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `<h2>Overall Rankings</h2>`;

    if (sorted.length === 0) {
        card.innerHTML += `<p>No players added yet.</p>`;
    }

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

        const sorted = [...players].sort((a, b) => {
            return (tierPoints[b.rankings?.[mode]] || 0) - (tierPoints[a.rankings?.[mode]] || 0);
        });

        let hasPlayers = false;

        sorted.forEach(player => {
            if (!player.rankings || !player.rankings[mode]) return;

            hasPlayers = true;

            const div = document.createElement("div");
            div.className = "player";

            div.innerHTML = `
                <span>${player.name}</span>
                <span class="tier">${player.rankings[mode]}</span>
            `;

            card.appendChild(div);
        });

        if (!hasPlayers) {
            card.innerHTML += `<p>No ranked players.</p>`;
        }

        content.appendChild(card);
    });
}

showOverall();
