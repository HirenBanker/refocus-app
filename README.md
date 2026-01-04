
# 🚫 Refocus - Reclaim Your Time

A high-performance focus tool designed to block distractions and improve productivity. 

## 🛡️ Local-First Privacy
Refocus now operates in **Local Privacy Mode**. Your data (profile, site lists, and session history) is stored exclusively in your browser's local storage. No data is sent to a cloud server.

## 💾 Data Management (Admin Only)
Admin users (Phone: `999`) have access to **Local Backup** tools in the Settings menu:

1. **Download Backup**: Saves your entire profile and configuration as a `.json` file to your PC.
2. **Restore Backup**: Allows you to upload a previously saved `.json` file to restore your settings or transfer them to another device.

## 🚀 Deployment
This app can be hosted on any static hosting provider (Vercel, Netlify, GitHub Pages).

### 1. Environment Variables
Ensure you provide your Google Gemini API key:
- `API_KEY`: Your Gemini API Key for focus tips.

### 2. Build
```bash
npm install
npm run build
```
