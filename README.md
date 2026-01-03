
# 🚫 Refocus - Deployment Guide

This app is built with **React**, **Vite**, and **Appwrite**. Because of Appwrite's security (CORS), it must be hosted on a stable domain like Vercel to function correctly with cloud sync.

## 🚀 How to Host on Vercel (Free)

### 1. Push to GitHub
- Create a new repository on GitHub (e.g., `refocus-app`).
- Upload all the files in this directory to that repository.
- Ensure `package.json` and `vite.config.ts` are in the root folder.

### 2. Connect to Vercel
- Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
- Click **"Add New"** > **"Project"**.
- Import your `refocus-app` repository.
- **Environment Variables:**
  - Add `API_KEY`: (Your Google Gemini API Key)
- Click **Deploy**.

### 3. Whitelist in Appwrite (CRITICAL)
- Once Vercel finishes, it will give you a URL (e.g., `https://refocus-app.vercel.app`).
- Copy this URL.
- Go to your [Appwrite Console](https://cloud.appwrite.io).
- Go to **Settings** > **Platforms**.
- Click **Add Platform** > **Web App**.
- Paste your Vercel URL into the **Hostname** field.

## 🛠 Troubleshooting CORS
If you still see "CORS ERROR" after deploying:
1. Double check that the Hostname in Appwrite matches your Vercel URL exactly (no `https://` or trailing slashes).
2. Ensure your Appwrite Collection permissions are set to **"Any"** for Create, Read, Update, and Delete during testing.
