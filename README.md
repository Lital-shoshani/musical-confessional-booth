# Musical Confessional Booth 🎵

A beautiful, anonymous platform for sharing secret songs with YouTube integration.

## Features

✅ **YouTube Search Integration** - Real-time autocomplete as you type  
✅ **Song Preview** - Listen to 30-second+ previews with embedded YouTube player  
✅ **Autocomplete Dropdown** - Smart suggestions with thumbnails  
✅ **localStorage Tracking** - All submissions stored locally with timestamps  
✅ **Admin Dashboard** - View, export (CSV), and manage all submissions  
✅ **Elegant UI** - Gradient borders, smooth animations, responsive design  
✅ **Privacy First** - Autocomplete disabled, anonymous submissions  

## Setup Instructions

### 1. Get YouTube API Key

**IMPORTANT**: The API key in `config.js` is compromised (publicly visible). You MUST create a new one:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "Musical Confessional Booth"
3. Enable **YouTube Data API v3**:
   - Click hamburger menu (☰) → APIs & Services → Library
   - Search for "YouTube Data API v3"
   - Click "ENABLE"
4. Create credentials:
   - APIs & Services → Credentials → "+ CREATE CREDENTIALS" → "API key"
   - **IMPORTANT**: Click "RESTRICT KEY"
   - Under "API restrictions" → Select "YouTube Data API v3"
   - Under "Website restrictions" → Add your GitHub Pages domain
5. Copy your new API key

### 2. Configure API Key

1. Open `config.js`
2. Replace the API key:
   ```javascript
   const CONFIG = {
       YOUTUBE_API_KEY: 'YOUR_NEW_API_KEY_HERE'
   };
   ```
3. Save the file

### 3. Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select your branch and `/` (root) folder
4. Save

Your site will be live at: `https://yourusername.github.io/musical-confessional-booth/`

## Usage

### For Users

1. Click "I'm ready to confess"
2. Start typing a song name
3. Select from autocomplete dropdown
4. Click play button to preview
5. Click "Send the secret" to submit

### For Admin

Access the admin dashboard at: `https://yourusername.github.io/musical-confessional-booth/admin.html`

**Features:**
- View all submissions in a sortable table
- See statistics (total, today, this week)
- Export to CSV for manual playlist creation
- Clear all data (with confirmation)

## File Structure

```
├── index.html          # Main application
├── admin.html          # Admin dashboard
├── styles.css          # All styles
├── script.js           # YouTube integration & logic
├── config.js           # API key (git-ignored)
├── config.example.js   # Example config file
├── .gitignore          # Excludes config.js
└── README.md           # This file
```

## Security Notes

⚠️ **config.js is git-ignored** to protect your API key  
⚠️ **Restrict your API key** to prevent unauthorized use  
⚠️ **Monitor API usage** in Google Cloud Console  

## Troubleshooting

### "YouTube API key not configured"

Make sure:
1. `config.js` exists in the root directory
2. The API key is not `YOUR_API_KEY_HERE`
3. The file is properly formatted

### Autocomplete not working

Check:
1. API key is valid and restricted correctly
2. YouTube Data API v3 is enabled
3. Browser console for errors

### No submissions in admin

Submissions are stored in localStorage:
- Check browser's localStorage (`F12` → Application → Local Storage)
- Make sure cookies/storage are enabled
- Try a different browser

## API Quota

YouTube Data API free tier: **10,000 units/day**
- Search query: ~100 units
- Daily capacity: ~100 searches

Monitor usage at: [Google Cloud Console](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)

## Migration to Spotify

When Spotify API access reopens:
1. Keep YouTube for search/preview
2. Add server-side function to add tracks to Spotify playlist
3. UI stays identical - just swap the backend

## License

MIT License - Free to use and modify

## Credits

Built with ❤️ for anonymous music sharing
