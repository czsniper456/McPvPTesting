function login() {
    const username = document.getElementById("githubUser").value.trim();
    const password = document.getElementById("githubPass").value.trim();

    // TEMPORARY SECURITY — replace with GitHub OAuth later
    if (username === "czsniper456" && password === "YOUR_SECRET_PASSWORD") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
    } else {
        alert("Access Denied");
    }
}

function getPlayers() {
    return JSON.parse(localStorage.getItem("mcpvp_players")) || [];
}

function savePlayers(players) {
    localStorage.setItem("mcpvp_players", JSON.stringify(players));
}

function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    const gamemode = document.getElementById("gamemode").value;
    const tier = document.getElementById("tier").value;

    if (!playerName) {
        document.getElementById("status").innerHTML =
            "Enter a player name.";
        return;
    }

    let players = getPlayers();

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

    savePlayers(players);

    document.getElementById("status").innerHTML =
        `${playerName} saved successfully.`;
}

function changeTier() {
    addPlayer();
}

function removeRank() {
    const playerName = document.getElementById("playerName").value.trim();
    const gamemode = document.getElementById("gamemode").value;

    let players = getPlayers();

    let player = players.find(
        p => p.name.toLowerCase() === playerName.toLowerCase()
    );

    if (!player) {
        document.getElementById("status").innerHTML =
            "Player not found.";
        return;
    }

    delete player.rankings[gamemode];

    savePlayers(players);

    document.getElementById("status").innerHTML =
        `${gamemode} removed from ${playerName}.`;
}

function deletePlayer() {
    const playerName = document.getElementById("playerName").value.trim();

    if (!playerName) {
        document.getElementById("status").innerHTML =
            "Enter a player name to delete.";
        return;
    }

    let players = getPlayers();

    const index = players.findIndex(
        p => p.name.toLowerCase() === playerName.toLowerCase()
    );

    if (index === -1) {
        document.getElementById("status").innerHTML =
            "Player not found.";
        return;
    }

    players.splice(index, 1); // <-- FIXED

    savePlayers(players);

    document.getElementById("status").innerHTML =
        `${playerName} deleted successfully.`;
}
