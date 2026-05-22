const content = document.getElementById("content");
        }

        div.innerHTML = `
            <div>
                <div style="font-size:1.2rem;font-weight:bold;">
                    ${player.name}
                </div>

                <div style="margin-top:8px;opacity:0.9;">
                    ${gamemodeRanks}
                </div>
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

        const rankedPlayers = players
            .filter(player => player.rankings && player.rankings[mode])
            .sort((a, b) => {
                return (
                    (tierPoints[b.rankings[mode]] || 0) -
                    (tierPoints[a.rankings[mode]] || 0)
                );
            });

        if (rankedPlayers.length === 0) {
            card.innerHTML += `<p>No ranked players.</p>`;
        }

        rankedPlayers.forEach(player => {
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
