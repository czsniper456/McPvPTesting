function login() {
    const username = document.getElementById("githubUser").value;

    if (username === "czsniper456") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
    } else {
        alert("Access Denied");
    }
}

function addPlayer() {
    const playerName = document.getElementById("playerName").value;
    const gamemode = document.getElementById("gamemode").value;
    const tier = document.getElementById("tier").value;

    let player = players.find(p => p.name === playerName);

    if (!player) {
        player = {
            name: playerName,
            rankings: {}
        };

        players.push(player);
    }

    player.rankings[gamemode] = tier;

    document.getElementById("status").innerHTML = `Saved ${playerName} (${gamemode} = ${tier})`;

    console.log(players);
}

function removeRank() {
    const playerName = document.getElementById("playerName").value;
    const gamemode = document.getElementById("gamemode").value;

    let player = players.find(p => p.name === playerName);

    if (!player) {
        document.getElementById("status").innerHTML = "Player not found";
        return;
    }

    delete player.rankings[gamemode];

    document.getElementById("status").innerHTML = `Removed ${gamemode} rank from ${playerName}`;

    console.log(players);
}
