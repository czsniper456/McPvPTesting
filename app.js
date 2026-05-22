const content = document.getElementById("content");

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
            return (tierPoints[b.rankings[mode]] || 0) - (tierPoints[a.rankings[mode]] || 0);
        });

        sorted.forEach(player => {
            if (!player.rankings[mode]) return;

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
