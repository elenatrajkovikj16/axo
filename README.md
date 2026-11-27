# 🦑 Axolotl Tracker - Setup Guide

## What You Have

Your mobile web app is complete and ready to use! Files:
- `index.html` - Main app structure
- `styles.css` - Beautiful aquatic theme
- `app.js` - All the functionality
- `config.js` - Your Google Sheets credentials

## 🔧 Google Sheet Setup (DO THIS FIRST)

You need to create a Google Sheet with the right structure:

### 1. Create the Sheet Structure

Go to [Google Sheets](https://sheets.google.com) and create a new sheet called "Axolotl Tracker"

Add these **three tabs** (sheet names):

#### Tab 1: "Feedings"
Add header row with columns:
```
Date | FoodType | Amount
```
Example data:
```
2026-11-27 | Frozen worms | 5
2026-11-28 | Live worms | 3
```

#### Tab 2: "Tank"
Add header row with columns:
```
Date | Looks | Happiness | Activity | Notes
```
Example data:
```
2026-11-27 | Great | Very Happy | Very Active | Looking good!
```

#### Tab 3: "Axolotl"
Just put a header row:
```
AxolotlName | (axolotl name goes here)
```

### 2. Share Your Sheet

Your API key needs access. The easiest way:
- Share the sheet with **anyone with the link** (edit mode)
- Or make it public

### 3. Verify It Works

1. Open `index.html` in a browser
2. Login with:
   - Username: `axolokum`
   - Password: `Lokum4o!`
3. Try logging a feeding
4. Check your Google Sheet - it should appear there!

---

## 📱 How to Use

### Login
- Username: `axolokum`
- Password: `Lokum4o!`

### Dashboard 📅
- See a calendar with feeding dates
- Quick stats on feeding frequency
- Set/view your axolotl's name

### Feed 🍽️
- Log each feeding with:
  - Date
  - Food type (Frozen worms, Live worms, Bloodworms, Salmon pellets)
  - Amount (number)

### Tank 🏠
- Track tank status:
  - Looks (Great, Good, Fair, Poor)
  - Happiness (Very Happy → Unhappy)
  - Activity level (Very Active → Lethargic)
  - Optional notes

### Stats 📊
- Total feedings
- Average feedings per week
- Most common food type
- Average happiness level
- Charts and trends

### Settings ⚙️
- Set/change your axolotl's name

---

## 🚀 Deploy to GitHub Pages

### 1. Create a GitHub Repository
```bash
cd /path/to/your/axo/folder
git init
git add .
git commit -m "Initial commit: Axolotl tracker app"
```

### 2. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/axolotl-tracker.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository Settings
2. Find "Pages" section (left sidebar)
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "root" folder
5. Click Save

Your app will be live at: `https://YOUR_USERNAME.github.io/axolotl-tracker/`

---

## 🔒 Important Security Notes

The API key and credentials are in your code (visible to anyone). This is fine because:
- It's a personal hobby project
- Google Sheets data isn't sensitive
- You can always disable the API key if needed

If you ever want to make this production-ready:
- Move credentials to a backend server
- Use environment variables
- Add proper authentication

---

## ⚠️ Troubleshooting

### "Failed to save to Google Sheets"
- Check your Sheet ID in `config.js`
- Verify your Sheet is shared/public
- Make sure the API key is correct
- Check browser console for errors (F12)

### Data not appearing in Sheet
- Verify the sheet tab names match exactly: "Feedings", "Tank", "Axolotl"
- Check that you're logged in
- Try opening the Network tab (F12) to see API responses

### Logout isn't working
- Local storage is cleared, but browser might cache
- Try a hard refresh (Ctrl+F5)

---

## 🎨 Customization

### Change colors
Edit `styles.css` - look for `:root` variables at the top:
```css
--primary: #0ea5e9;      /* Blue tones */
--accent: #06b6d4;       /* Cyan */
--success: #10b981;      /* Green */
```

### Change login credentials
Edit `config.js`:
```js
ADMIN_USERNAME: 'axolokum',
ADMIN_PASSWORD: 'Lokum4o!',
```

### Add more food types
Edit the `foodType` dropdown in `index.html` (line ~125)

---

## 📞 Need Help?

If something isn't working:
1. Check browser console (F12 → Console tab)
2. Verify Google Sheet structure matches the guide
3. Make sure API key hasn't expired or been revoked
4. Check that sheet tabs are named correctly

Enjoy tracking your axolotl! 🦑💙
