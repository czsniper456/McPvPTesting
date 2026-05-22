// Tier Point System
const tierPoints = {
    'HT1': 10,
    'HT2': 9,
    'HT3': 8,
    'LT1': 7,
    'LT2': 6,
    'LT3': 5,
    'LT4': 4,
    'LT5': 3,
    'RHT1': 10,
    'RHT2': 9,
    'RHT3': 8,
    'RLT1': 7,
    'RLT2': 6,
    'RLT3': 5,
    'RLT4': 4,
    'RLT5': 3
};

const gamemodes = [
    { id: 'crystal', name: 'Crystal', emoji: '💎' },
    { id: 'axe', name: 'Axe', emoji: '🪓' },
    { id: 'sword', name: 'Sword', emoji: '⚔️' },
    { id: 'mace', name: 'Mace', emoji: '🔨' },
    { id: 'uhc', name: 'UHC', emoji: '💘' },
    { id: 'smp', name: 'SMP', emoji: '🌍' },
    { id: 'neth_pot', name: 'Neth Pot', emoji: '🌶️' },
    { id: 'pot', name: 'Pot', emoji: '🍷' },
    { id: 'spearmace', name: 'Spearmace', emoji: '🗡️' }
];

let players = JSON.parse(localStorage.getItem('mctiers_players')) || [
    {
        name: 'Player1',
        tiers: {
            crystal: 'HT1',
            axe: 'LT2',
            sword: 'LT1',
            mace: 'HT2',
            uhc: 'LT3',
            smp: 'LT5',
            neth_pot: '',
            pot: 'LT4',
            spearmace: ''
        }
    }
];

let isAdmin = false;
let currentGamemode = 'overall';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    loadTiers();
    updateStats();
    setupTabs();
    setupGamemodes();
    setupEventListeners();
});

// Setup Gamemodes
function setupGamemodes() {
    const buttons = document.querySelectorAll('.gamemode-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGamemode = btn.getAttribute('data-gamemode');
            document.getElementById('gamemode-header').textContent = btn.textContent;
            loadLeaderboard();
        });
    });
}

// Setup Tabs
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

// Calculate Player Points
function calculatePlayerPoints(player) {
    let totalPoints = 0;
    for (let gamemode in player.tiers) {
        const tier = player.tiers[gamemode];
        if (tier && tierPoints[tier]) {
            totalPoints += tierPoints[tier];
        }
    }
    return totalPoints;
}

// Get Player Tier for Gamemode
function getPlayerTierForGamemode(player, gamemode) {
    if (gamemode === 'overall') {
        return null; // Overall shows points, not tier
    }
    return player.tiers[gamemode] || '';
}

// Load Leaderboard
function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    let sorted = [...players];

    if (currentGamemode === 'overall') {
        // Sort by overall points
        sorted.sort((a, b) => calculatePlayerPoints(b) - calculatePlayerPoints(a));
        
        sorted.forEach((player, index) => {
            const points = calculatePlayerPoints(player);
            const tiersDisplay = gamemodes.map(gm => {
                const tier = player.tiers[gm.id];
                return tier ? `${gm.emoji} ${tier}` : '';
            }).filter(t => t).join(', ');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${index + 1}</td>
                <td>${player.name}</td>
                <td>${tiersDisplay}</td>
                <td><span class="tier-badge" style="background: linear-gradient(90deg, #e94560, #ff6b9d);">${points} pts</span></td>
                <td>Overall</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        // Sort by specific gamemode tier
        sorted.sort((a, b) => {
            const aPoints = tierPoints[a.tiers[currentGamemode]] || 0;
            const bPoints = tierPoints[b.tiers[currentGamemode]] || 0;
            return bPoints - aPoints;
        });

        sorted.forEach((player, index) => {
            const tier = player.tiers[currentGamemode] || 'Unranked';
            const points = tierPoints[tier] || 0;
            const tierClass = tier !== 'Unranked' ? `tier-${tier.toLowerCase()}` : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${index + 1}</td>
                <td>${player.name}</td>
                <td><span class="tier-badge ${tierClass}">${tier}</span></td>
                <td>${points} pts</td>
                <td>${currentGamemode.replace('_', ' ').toUpperCase()}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Load Tiers
function loadTiers() {
    const grid = document.getElementById('tiersGrid');
    grid.innerHTML = '';

    const tierOrder = ['HT1', 'HT2', 'HT3', 'LT1', 'LT2', 'LT3', 'LT4', 'LT5', 'RHT1', 'RHT2', 'RHT3', 'RLT1', 'RLT2', 'RLT3', 'RLT4', 'RLT5'];

    tierOrder.forEach(tier => {
        const points = tierPoints[tier];
        const card = document.createElement('div');
        card.className = 'tier-card';
        
        card.innerHTML = `
            <div class="tier-name" style="color: #e94560;">🏆 ${tier}</div>
            <div class="tier-points">${points} Points</div>
        `;
        
        grid.appendChild(card);
    });
}

// Update Statistics
function updateStats() {
    const totalPlayers = players.length;
    const ht1Count = players.filter(p => Object.values(p.tiers).includes('HT1')).length;
    const lt1Count = players.filter(p => Object.values(p.tiers).includes('LT1')).length;
    const avgPoints = totalPlayers > 0 
        ? (players.reduce((sum, p) => sum + calculatePlayerPoints(p), 0) / totalPlayers).toFixed(1)
        : 0;

    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('ht1Count').textContent = ht1Count;
    document.getElementById('lt1Count').textContent = lt1Count;
    document.getElementById('avgPoints').textContent = avgPoints;
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
    
    if (!name) {
        alert('Please enter a player name!');
        return;
    }

    const tiers = {};
    gamemodes.forEach(gm => {
        const selectId = `${gm.id}-tier`;
        tiers[gm.id] = document.getElementById(selectId).value;
    });

    const existing = players.findIndex(p => p.name === name);
    if (existing !== -1) {
        players[existing].tiers = tiers;
    } else {
        players.push({ name, tiers });
    }

    saveData();
    loadLeaderboard();
    updateStats();
    loadPlayersList();

    document.getElementById('playerName').value = '';
    gamemodes.forEach(gm => {
        document.getElementById(`${gm.id}-tier`).value = '';
    });

    alert('✅ Player added/updated!');
}

function loadPlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';

    players.forEach(player => {
        const points = calculatePlayerPoints(player);
        const tiersDisplay = gamemodes.map(gm => {
            const tier = player.tiers[gm.id];
            return tier ? `${gm.emoji} ${tier}` : '';
        }).filter(t => t).join(', ');

        const item = document.createElement('div');
        item.className = 'player-item';
        
        item.innerHTML = `
            <div>
                <strong>${player.name}</strong> (${points} pts)
                <div class="player-tiers">${tiersDisplay || 'No tiers'}</div>
            </div>
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
    localStorage.setItem('mctiers_players', JSON.stringify(players));
}

function exportData() {
    const dataStr = JSON.stringify(players, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mctiers-players.json';
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

    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    let filtered = players.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search);
        let matchesTier = !filter;
        
        if (filter) {
            if (currentGamemode === 'overall') {
                matchesTier = Object.values(p.tiers).includes(filter);
            } else {
                matchesTier = p.tiers[currentGamemode] === filter;
            }
        }
        
        return matchesSearch && matchesTier;
    });

    if (currentGamemode === 'overall') {
        filtered.sort((a, b) => calculatePlayerPoints(b) - calculatePlayerPoints(a));
        
        filtered.forEach((player, index) => {
            const points = calculatePlayerPoints(player);
            const tiersDisplay = gamemodes.map(gm => {
                const tier = player.tiers[gm.id];
                return tier ? `${gm.emoji} ${tier}` : '';
            }).filter(t => t).join(', ');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${index + 1}</td>
                <td>${player.name}</td>
                <td>${tiersDisplay}</td>
                <td><span class="tier-badge" style="background: linear-gradient(90deg, #e94560, #ff6b9d);">${points} pts</span></td>
                <td>Overall</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        filtered.sort((a, b) => {
            const aPoints = tierPoints[a.tiers[currentGamemode]] || 0;
            const bPoints = tierPoints[b.tiers[currentGamemode]] || 0;
            return bPoints - aPoints;
        });

        filtered.forEach((player, index) => {
            const tier = player.tiers[currentGamemode] || 'Unranked';
            const points = tierPoints[tier] || 0;
            const tierClass = tier !== 'Unranked' ? `tier-${tier.toLowerCase()}` : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${index + 1}</td>
                <td>${player.name}</td>
                <td><span class="tier-badge ${tierClass}">${tier}</span></td>
                <td>${points} pts</td>
                <td>${currentGamemode.replace('_', ' ').toUpperCase()}</td>
            `;
            tbody.appendChild(row);
        });
    }
});

document.getElementById('tierFilter').addEventListener('change', () => {
    document.getElementById('searchBox').dispatchEvent(new KeyboardEvent('keyup'));
});

function setupEventListeners() {
    // Already handled above
}