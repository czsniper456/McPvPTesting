// Tier System
const tiers = [
    { name: 'Mythic', color: '#ff6b9d', minWins: 500 },
    { name: 'Legend', color: '#f5576c', minWins: 400 },
    { name: 'Elite', color: '#fee140', minWins: 300 },
    { name: 'Master', color: '#330867', minWins: 250 },
    { name: 'Diamond', color: '#fed6e3', minWins: 200 },
    { name: 'Platinum', color: '#ff6a88', minWins: 150 },
    { name: 'Gold', color: '#ffe259', minWins: 100 },
    { name: 'Silver', color: '#e0e9ff', minWins: 50 },
    { name: 'Bronze', color: '#cc8b86', minWins: 10 },
    { name: 'Unranked', color: '#764ba2', minWins: 0 }
];

let players = JSON.parse(localStorage.getItem('mcpvpPlayers')) || [
    { name: 'Player1', tier: 'Diamond', wins: 150, kills: 450 },
    { name: 'Player2', tier: 'Gold', wins: 80, kills: 240 },
    { name: 'Player3', tier: 'Platinum', wins: 120, kills: 380 }
];

let isAdmin = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    loadTiers();
    updateStats();
    setupTabs();
    setupEventListeners();
});

// Tab System
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Load Leaderboard
function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    let sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);

    sortedPlayers.forEach((player, index) => {
        const ratio = (player.kills / player.wins).toFixed(2);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${player.name}</td>
            <td><span class="tier-badge tier-${player.tier.toLowerCase()}">${player.tier}</span></td>
            <td>${player.wins}</td>
            <td>${player.kills}</td>
            <td>${ratio}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Load Tiers
function loadTiers() {
    const grid = document.getElementById('tiersGrid');
    grid.innerHTML = '';

    tiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = 'tier-card';
        card.style.borderColor = tier.color;
        
        card.innerHTML = `
            <div class="tier-name" style="color: ${tier.color}">🏆 ${tier.name}</div>
            <div class="tier-description">Min Wins: ${tier.minWins}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Update Statistics
function updateStats() {
    const totalPlayers = players.length;
    const totalWins = players.reduce((sum, p) => sum + p.wins, 0);
    const totalKills = players.reduce((sum, p) => sum + p.kills, 0);
    const avgRatio = totalWins > 0 ? (totalKills / totalWins).toFixed(2) : 0;

    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalKills').textContent = totalKills;
    document.getElementById('avgRatio').textContent = avgRatio;
}

// Admin Functions
document.getElementById('adminBtn').addEventListener('click', () => {
    document.querySelector('.tab-btn[data-tab="admin"]').click();
});

function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    
    if (username === 'czsniper456') {
        isAdmin = true;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminTabBtn').style.display = 'block';
        loadPlayersList();
    } else {
        alert('❌ Invalid username!');
    }
}

function addPlayer() {
    const name = document.getElementById('playerName').value.trim();
    const tier = document.getElementById('playerTier').value;
    const wins = parseInt(document.getElementById('playerWins').value) || 0;
    const kills = parseInt(document.getElementById('playerKills').value) || 0;

    if (!name) {
        alert('Please enter a player name!');
        return;
    }

    const existing = players.findIndex(p => p.name === name);
    if (existing !== -1) {
        players[existing] = { name, tier, wins, kills };
    } else {
        players.push({ name, tier, wins, kills });
    }

    saveData();
    loadLeaderboard();
    updateStats();
    loadPlayersList();

    document.getElementById('playerName').value = '';
    document.getElementById('playerWins').value = '';
    document.getElementById('playerKills').value = '';

    alert('✅ Player added/updated!');
}

function loadPlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';

    players.forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item';
        
        item.innerHTML = `
            <span>${player.name} - ${player.tier} (${player.wins}W - ${player.kills}K)</span>
            <button onclick="removePlayer('${player.name}')">Delete</button>
        `;
        
        list.appendChild(item);
    });
}

function removePlayer(name) {
    if (confirm(`Delete ${name}?`)) {
        players = players.filter(p => p.name !== name);
        saveData();
        loadLeaderboard();
        updateStats();
        loadPlayersList();
    }
}

function saveData() {
    localStorage.setItem('mcpvpPlayers', JSON.stringify(players));
}

function exportData() {
    const dataStr = JSON.stringify(players, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcpvp-players.json';
    a.click();
}

document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            players = JSON.parse(event.target.result);
            saveData();
            loadLeaderboard();
            updateStats();
            loadPlayersList();
            alert('✅ Data imported successfully!');
        } catch (err) {
            alert('❌ Invalid file format!');
        }
    };
    reader.readAsText(file);
});

function clearCompleted() {
    if (confirm('Clear players with completed tiers?')) {
        // This is a placeholder - customize based on your needs
        alert('Feature customizable based on your needs!');
    }
}

function clearAll() {
    if (confirm('⚠️ This will delete ALL data! Are you sure?')) {
        players = [];
        saveData();
        loadLeaderboard();
        updateStats();
        loadPlayersList();
        alert('✅ All data cleared!');
    }
}

// Search and Filter
document.getElementById('searchBox').addEventListener('keyup', () => {
    const search = document.getElementById('searchBox').value.toLowerCase();
    const filter = document.getElementById('tierFilter').value;

    let filtered = players.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search);
        const matchesTier = !filter || p.tier === filter;
        return matchesSearch && matchesTier;
    });

    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    filtered.sort((a, b) => b.wins - a.wins).forEach((player, index) => {
        const ratio = (player.kills / player.wins).toFixed(2);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${player.name}</td>
            <td><span class="tier-badge tier-${player.tier.toLowerCase()}">${player.tier}</span></td>
            <td>${player.wins}</td>
            <td>${player.kills}</td>
            <td>${ratio}</td>
        `;
        
        tbody.appendChild(row);
    });
});

document.getElementById('tierFilter').addEventListener('change', () => {
    document.getElementById('searchBox').dispatchEvent(new KeyboardEvent('keyup'));
});

function setupEventListeners() {
    // Already handled above
}