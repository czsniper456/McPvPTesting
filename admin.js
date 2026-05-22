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
    players = JSON.parse(localStorage.getItem("mcpvp_players")) || [];

    const playerName = document.getElementById("playerName").value.trim();
    const gamemode = document.getElementById("gamemode").value;
    const tier = document.getElementById("tier").value;

    if (!playerName) {
        document.getElementById("status").innerHTML = "Enter a player name";
        return;
    }

    let player = players.find(
        p => p.name.toLowerCase() === playerName.toLowerCase()
    );

    if (!player) {
        player = {
            name: playerName,
            rankings: {}
        };

        players.push(player);
    }

    player.rankings[gamemode] = tier;

    savePlayers();

    document.getElementById("status").innerHTML = `Updated ${playerName} (${gamemode} = ${tier})`;

    console.log(players);
}

function changeTier() {
    addPlayer();
}
