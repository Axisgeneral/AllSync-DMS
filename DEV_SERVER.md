# Quick Server Start Guide

## 🚀 Easy Start Methods

### Method 1: Double-click the Batch File (Easiest!)
1. Double-click `start-dev.bat` in the project root
2. Wait for the servers to start
3. Open your browser to http://localhost:3000

### Method 2: From Command Line
```powershell
npm run dev
```

### Method 3: VS Code Terminal
1. Open Terminal in VS Code
2. Run: `npm run dev`
3. The servers will start automatically

## 📍 Server Addresses

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 🔐 Login Credentials

- **Admin**: username: `admin` / password: `admin123`
- **Sales**: username: `sales` / password: `sales123`

## 🛑 Stopping the Servers

Press `Ctrl + C` in the terminal where the servers are running

## 🔄 Auto-Restart

The servers automatically restart when you make code changes:
- Backend restarts when you edit `.js` files in `/server`
- Frontend recompiles when you edit `.tsx` or `.ts` files in `/client/src`

## 💡 Tips

- Keep the terminal window open while developing
- The browser will automatically refresh when frontend code changes
- Check the terminal for any errors or compilation messages
- If you can't see the app, wait a few seconds for React to finish compiling
