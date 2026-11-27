// APP STATE
let appState = {
    isLoggedIn: false,
    currentMonth: new Date(),
    axolotlName: 'Unnamed',
    feedings: [],
    tankLogs: [],
    axolotlData: {}
};

// STARTUP
document.addEventListener('DOMContentLoaded', () => {
    setDefaultDate();
    setDefaultTankDate();
    loadFromLocalStorage();
    // Ensure currentMonth is a Date object
    if (typeof appState.currentMonth === 'string') {
        appState.currentMonth = new Date(appState.currentMonth);
    }
});

// ==================== LOGIN ====================
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
        appState.isLoggedIn = true;
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('appScreen').classList.add('active');
        saveToLocalStorage();
        loadAllData();
        updateDashboard();
    } else {
        document.getElementById('loginError').textContent = '❌ Invalid username or password';
    }
}

function logout() {
    appState.isLoggedIn = false;
    document.getElementById('appScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
    localStorage.clear();
}

// ==================== NAVIGATION ====================
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Update content when switching tabs
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'analytics') {
        updateAnalytics();
    } else if (tabName === 'settings') {
        document.getElementById('axolotlName').value = appState.axolotlName;
    }
}

// ==================== FEEDING FUNCTIONS ====================
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('feedDate').value = today;
}

function saveFeed(event) {
    event.preventDefault();

    const date = document.getElementById('feedDate').value;
    const foodType = document.getElementById('foodType').value;
    const amount = parseInt(document.getElementById('feedAmount').value);

    // Check if editing
    if (document.getElementById('feedingForm').dataset.editing === 'true') {
        const editIndex = parseInt(document.getElementById('feedingForm').dataset.editIndex);
        appState.feedings[editIndex] = { date, foodType, amount };
        document.getElementById('feedingForm').dataset.editing = 'false';
        document.getElementById('feedingForm').dataset.editIndex = '';
        showStatus('feedStatus', '✅ Feeding updated!', 'success');
    } else {
        const feeding = { date, foodType, amount };
        appState.feedings.push(feeding);
        showStatus('feedStatus', '✅ Feeding logged!', 'success');
    }

    // Reset form
    document.getElementById('feedingForm').reset();
    setDefaultDate();

    updateDashboard();
    updateRecentFeeds();

    // Save to local storage
    saveToLocalStorage();
}

function updateRecentFeeds() {
    const recentFeeds = appState.feedings.slice(-5).reverse();
    const feedList = document.getElementById('recentFeeds');
    feedList.innerHTML = '';

    if (recentFeeds.length === 0) {
        feedList.innerHTML = '<p style="color: #64748b; text-align: center;">No feedings logged yet</p>';
        return;
    }

    recentFeeds.forEach((feed, index) => {
        const actualIndex = appState.feedings.length - 1 - index;
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <div class="feed-item-date">${formatDate(feed.date)}</div>
                    <div class="feed-item-type"><strong>${feed.foodType}</strong></div>
                    <div class="feed-item-amount">Amount: ${feed.amount}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit" onclick="editFeeding(${actualIndex})">✏️</button>
                    <button class="btn-delete" onclick="deleteFeeding(${actualIndex})">🗑️</button>
                </div>
            </div>
        `;
        feedList.appendChild(feedItem);
    });
}

function editFeeding(index) {
    const feeding = appState.feedings[index];
    document.getElementById('feedDate').value = feeding.date;
    document.getElementById('foodType').value = feeding.foodType;
    document.getElementById('feedAmount').value = feeding.amount;
    
    // Set a flag so we know we're editing
    document.getElementById('feedingForm').dataset.editIndex = index;
    document.getElementById('feedingForm').dataset.editing = 'true';
    
    // Scroll to form
    document.getElementById('feedingForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteFeeding(index) {
    if (confirm('Delete this feeding log?')) {
        appState.feedings.splice(index, 1);
        saveToLocalStorage();
        updateRecentFeeds();
        updateDashboard();
        showStatus('feedStatus', '🗑️ Feeding deleted', 'success');
    }
}

// ==================== TANK FUNCTIONS ====================
function setDefaultTankDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tankDate').value = today;
}

function saveTank(event) {
    event.preventDefault();

    const date = document.getElementById('tankDate').value;
    const looks = document.getElementById('tankLooks').value;
    const happiness = document.getElementById('tankHappiness').value;
    const activity = document.getElementById('tankActivity').value;
    const notes = document.getElementById('tankNotes').value;

    // Check if editing
    if (document.getElementById('tankForm').dataset.editing === 'true') {
        const editIndex = parseInt(document.getElementById('tankForm').dataset.editIndex);
        appState.tankLogs[editIndex] = { date, looks, happiness, activity, notes };
        document.getElementById('tankForm').dataset.editing = 'false';
        document.getElementById('tankForm').dataset.editIndex = '';
        showStatus('tankStatus', '✅ Tank log updated!', 'success');
    } else {
        const tankLog = { date, looks, happiness, activity, notes };
        appState.tankLogs.push(tankLog);
        showStatus('tankStatus', '✅ Tank status saved!', 'success');
    }

    // Reset form
    document.getElementById('tankForm').reset();
    setDefaultTankDate();

    updateRecentTankLogs();

    // Save to local storage
    saveToLocalStorage();
}

function updateRecentTankLogs() {
    const recentLogs = appState.tankLogs.slice(-5).reverse();
    const logList = document.getElementById('recentTankLogs');
    logList.innerHTML = '';

    if (recentLogs.length === 0) {
        logList.innerHTML = '<p style="color: #64748b; text-align: center;">No tank logs yet</p>';
        return;
    }

    recentLogs.forEach((log, index) => {
        const actualIndex = appState.tankLogs.length - 1 - index;
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <div class="log-item-date">${formatDate(log.date)}</div>
                    <div class="log-item-type">
                        <strong>Looks:</strong> ${log.looks} | 
                        <strong>Happiness:</strong> ${log.happiness} | 
                        <strong>Activity:</strong> ${log.activity}
                    </div>
                    ${log.notes ? `<div class="log-item-amount">📝 ${log.notes}</div>` : ''}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-edit" onclick="editTankLog(${actualIndex})">✏️</button>
                    <button class="btn-delete" onclick="deleteTankLog(${actualIndex})">🗑️</button>
                </div>
            </div>
        `;
        logList.appendChild(logItem);
    });
}

function editTankLog(index) {
    const log = appState.tankLogs[index];
    document.getElementById('tankDate').value = log.date;
    document.getElementById('tankLooks').value = log.looks;
    document.getElementById('tankHappiness').value = log.happiness;
    document.getElementById('tankActivity').value = log.activity;
    document.getElementById('tankNotes').value = log.notes;
    
    // Set a flag so we know we're editing
    document.getElementById('tankForm').dataset.editIndex = index;
    document.getElementById('tankForm').dataset.editing = 'true';
    
    // Scroll to form
    document.getElementById('tankForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteTankLog(index) {
    if (confirm('Delete this tank log?')) {
        appState.tankLogs.splice(index, 1);
        saveToLocalStorage();
        updateRecentTankLogs();
        showStatus('tankStatus', '🗑️ Tank log deleted', 'success');
    }
}

// ==================== SETTINGS ====================
function saveAxolotlName(event) {
    event.preventDefault();

    const name = document.getElementById('axolotlName').value.trim();
    if (!name) {
        showStatus('settingsStatus', 'Please enter a name', 'error');
        return;
    }

    appState.axolotlName = name;
    document.getElementById('axolotlNameDisplay').textContent = name;

    // Note: Google Sheets write requires OAuth - API key only allows reads
    // Data is saved to localStorage instead

    saveToLocalStorage();

    showStatus('settingsStatus', `${name} is ready! 🦑`, 'success');
    setTimeout(() => showTab('dashboard'), 1500);
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    // Update axolotl name
    document.getElementById('axolotlNameDisplay').textContent = appState.axolotlName;

    // Build calendar
    buildCalendar();

    // Update stats
    updateQuickStats();
    updateRecentFeeds();
}

function buildCalendar() {
    const year = appState.currentMonth.getFullYear();
    const month = appState.currentMonth.getMonth();

    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0).getDate();

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day empty';
        header.style.fontWeight = '700';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Previous month's days
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day empty';
        day.textContent = prevLastDay - i;
        calendar.appendChild(day);
    }

    // Current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasFeed = appState.feedings.some(f => f.date === dateStr);

        const day = document.createElement('div');
        day.className = 'calendar-day';
        if (hasFeed) {
            day.classList.add('has-data');
        }
        day.textContent = i;
        calendar.appendChild(day);
    }

    // Next month's days
    const remainingDays = 42 - calendar.children.length + 7; // Adjust for headers
    for (let i = 1; i <= remainingDays; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day empty';
        day.textContent = i;
        calendar.appendChild(day);
    }
}

function previousMonth() {
    appState.currentMonth.setMonth(appState.currentMonth.getMonth() - 1);
    buildCalendar();
}

function nextMonth() {
    appState.currentMonth.setMonth(appState.currentMonth.getMonth() + 1);
    buildCalendar();
}

function updateQuickStats() {
    // Feedings this month
    const now = new Date();
    const thisMonth = appState.feedings.filter(f => {
        const feedDate = new Date(f.date);
        return feedDate.getMonth() === now.getMonth() && feedDate.getFullYear() === now.getFullYear();
    });
    document.getElementById('monthFedCount').textContent = thisMonth.length;

    // Last fed date
    if (appState.feedings.length > 0) {
        const lastFed = new Date(appState.feedings[appState.feedings.length - 1].date);
        const daysAgo = Math.floor((now - lastFed) / (1000 * 60 * 60 * 24));
        if (daysAgo === 0) {
            document.getElementById('lastFedDate').textContent = 'Today';
        } else if (daysAgo === 1) {
            document.getElementById('lastFedDate').textContent = 'Yesterday';
        } else {
            document.getElementById('lastFedDate').textContent = `${daysAgo} days ago`;
        }
    }
}

// ==================== ANALYTICS ====================
function updateAnalytics() {
    // Total feedings
    document.getElementById('totalFeedings').textContent = appState.feedings.length;

    // Average per week
    if (appState.feedings.length > 0) {
        const firstDate = new Date(appState.feedings[0].date);
        const lastDate = new Date(appState.feedings[appState.feedings.length - 1].date);
        const daysSpan = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
        const weeksSpan = daysSpan / 7;
        const avgPerWeek = (appState.feedings.length / weeksSpan).toFixed(1);
        document.getElementById('avgFeedingsWeek').textContent = avgPerWeek || '0';
    }

    // Most fed food
    const foodCounts = {};
    appState.feedings.forEach(f => {
        foodCounts[f.foodType] = (foodCounts[f.foodType] || 0) + 1;
    });
    const mostFed = Object.keys(foodCounts).length > 0 
        ? Object.keys(foodCounts).reduce((a, b) => foodCounts[a] > foodCounts[b] ? a : b)
        : '-';
    document.getElementById('mostFedFood').textContent = mostFed;

    // Average happiness
    if (appState.tankLogs.length > 0) {
        const happinessMap = {
            'Very Happy': 4,
            'Happy': 3,
            'Neutral': 2,
            'Unhappy': 1
        };
        const avgScore = appState.tankLogs.reduce((sum, log) => sum + (happinessMap[log.happiness] || 0), 0) / appState.tankLogs.length;
        const happiness = ['😞', '😐', '🙂', '😊', '😄'][Math.round(avgScore)] || '😐';
        document.getElementById('avgHappiness').textContent = happiness;
    }

    // Feeding breakdown chart
    if (Object.keys(foodCounts).length > 0) {
        const breakdownHtml = '<div style="display: flex; flex-direction: column; gap: 10px;">' +
            Object.entries(foodCounts).map(([food, count]) => `
                <div>
                    <strong>${food}:</strong> ${count} times
                    <div style="background: #e0f2fe; height: 20px; border-radius: 5px; margin-top: 5px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #0ea5e9, #06b6d4); height: 100%; width: ${(count / Math.max(...Object.values(foodCounts))) * 100}%;"></div>
                    </div>
                </div>
            `).join('') +
            '</div>';
        document.getElementById('feedingBreakdown').innerHTML = breakdownHtml;
    }

    // Happiness trend
    if (appState.tankLogs.length > 0) {
        const lastLogs = appState.tankLogs.slice(-10);
        const happinessMap = {
            'Very Happy': '😊',
            'Happy': '🙂',
            'Neutral': '😐',
            'Unhappy': '😞'
        };
        const trendHtml = '<div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">' +
            lastLogs.map(log => `
                <div style="text-align: center;">
                    <div style="font-size: 2em;">${happinessMap[log.happiness] || '?'}</div>
                    <small style="color: #64748b; font-size: 0.8em;">${formatDate(log.date)}</small>
                </div>
            `).join('') +
            '</div>';
        document.getElementById('happinessTrend').innerHTML = trendHtml;
    }
}

// ==================== GOOGLE SHEETS API ====================
async function addFeedingToSheet(feeding) {
    try {
        const range = `${CONFIG.SHEETS.FEEDINGS}!A:C`;
        const values = [[feeding.date, feeding.foodType, feeding.amount]];

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}:append?key=${CONFIG.API_KEY}&insertDataOption=INSERT_ROWS`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to save feeding to Google Sheets:', data);
        } else {
            console.log('Feeding saved to Google Sheets ✅');
        }
    } catch (error) {
        console.error('Error adding feeding to sheet:', error);
    }
}

async function addTankLogToSheet(tankLog) {
    try {
        const range = `${CONFIG.SHEETS.TANK}!A:E`;
        const values = [[tankLog.date, tankLog.looks, tankLog.happiness, tankLog.activity, tankLog.notes]];

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}:append?key=${CONFIG.API_KEY}&insertDataOption=INSERT_ROWS`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to save tank log to Google Sheets:', data);
        } else {
            console.log('Tank log saved to Google Sheets ✅');
        }
    } catch (error) {
        console.error('Error adding tank log to sheet:', error);
    }
}

async function saveAxolotlNameToSheet(name) {
    try {
        const range = `${CONFIG.SHEETS.AXOLOTL}!A1:B1`;
        const values = [['AxolotlName', name]];

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.API_KEY}&valueInputOption=RAW`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to save axolotl name to Google Sheets:', data);
        } else {
            console.log('Axolotl name saved to Google Sheets ✅');
        }
    } catch (error) {
        console.error('Error saving axolotl name to sheet:', error);
    }
}

async function loadAllData() {
    // Try to load from Google Sheets first (optional, won't block if fails)
    // await loadFeedingsFromSheet();
    // await loadTankLogsFromSheet();
    // await loadAxolotlNameFromSheet();
    
    // Load from localStorage (this is the main source now)
    console.log('Loading data from local storage...');
}

async function loadFeedingsFromSheet() {
    try {
        const range = `${CONFIG.SHEETS.FEEDINGS}!A:C`;
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`
        );
        const data = await response.json();
        const rows = data.values || [];

        // Skip header row
        appState.feedings = rows.slice(1).map(row => ({
            date: row[0],
            foodType: row[1],
            amount: parseInt(row[2]) || 0
        })).filter(f => f.date);
    } catch (error) {
        console.error('Error loading feedings from sheet:', error);
    }
}

async function loadTankLogsFromSheet() {
    try {
        const range = `${CONFIG.SHEETS.TANK}!A:E`;
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`
        );
        const data = await response.json();
        const rows = data.values || [];

        // Skip header row
        appState.tankLogs = rows.slice(1).map(row => ({
            date: row[0],
            looks: row[1] || '',
            happiness: row[2] || '',
            activity: row[3] || '',
            notes: row[4] || ''
        })).filter(t => t.date);
    } catch (error) {
        console.error('Error loading tank logs from sheet:', error);
    }
}

async function loadAxolotlNameFromSheet() {
    try {
        const range = `${CONFIG.SHEETS.AXOLOTL}!B1`;
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`
        );
        const data = await response.json();
        const rows = data.values || [];

        if (rows.length > 0 && rows[0][0]) {
            appState.axolotlName = rows[0][0];
        }
    } catch (error) {
        console.error('Error loading axolotl name from sheet:', error);
    }
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    localStorage.setItem('axolotlAppState', JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('axolotlAppState');
    if (saved) {
        appState = JSON.parse(saved);
    }
}

// ==================== UTILITIES ====================
function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `status show ${type}`;
    setTimeout(() => {
        element.classList.remove('show');
    }, 3000);
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}
