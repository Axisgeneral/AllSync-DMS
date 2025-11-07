# AllSync DMS - Auto Dealer Management System

A comprehensive web-based dealership management system for automotive dealers.

## Features

- 📊 **Dashboard** - Real-time analytics and key performance indicators
- 🚗 **Inventory Management** - Track vehicles, pricing, and availability
- 👥 **Customer Management** - Complete CRM functionality
- 💰 **Sales Tracking** - Monitor deals, commissions, and performance
- 🔧 **Service Management** - Schedule appointments and track repairs
- 📈 **Reports & Analytics** - Detailed business insights
- 🔐 **User Authentication** - Secure role-based access control

## Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will run on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
AllSync DMS/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root dependencies
└── README.md
```

## License

MIT
