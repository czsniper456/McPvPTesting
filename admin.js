function login() {
    const username = document.getElementById("githubUser").value.trim();
    const password = document.getElementById("githubPass").value.trim();

    if (username === "czsniper456" && password === "Noobcztesting_123PvPMC") {
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
    const name = document.getElementById("playerName").value.trim();
    const mode = document.getElementById("gamemode").value;
    const tier = document.getElementById("tier").value;

    if (!name) return;

    let players = getPlayers();
    let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (!player) {
        player = { name, rankings: {} };
        players.push(player);
    }

    player.rankings[mode] = tier;
    savePlayers(players);
}

function removeRank() {
    const name = document.getElementById("playerName").value.trim();
    const mode = document.getElementById("gamemode").value;

    let players = getPlayers();
    let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (!player) return;

    delete player.rankings[mode];
    savePlayers(players);
}

function deletePlayer() {
    const name = document.getElementById("playerName").value.trim();
    let players = getPlayers();

    players = players.filter(p => p.name.toLowerCase() !== name.toLowerCase());
    savePlayers(players);
}
