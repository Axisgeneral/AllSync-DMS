# AllSync DMS - Setup Guide

## Quick Start

Follow these steps to get your Auto Dealer Management System up and running:

### 1. Install Dependencies

First, install the backend dependencies:
```powershell
cd "c:\Users\tmorales\Downloads\Projects\AllSync DMS"
npm install
```

Then install the frontend dependencies:
```powershell
cd client
npm install
cd ..
```

### 2. Environment Setup

Copy the example environment file:
```powershell
copy .env.example .env
```

Edit the `.env` file with your settings (optional for demo):
- `PORT`: Backend server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

### 3. Run the Application

Start both backend and frontend servers:
```powershell
npm run dev
```

Or run them separately:

**Backend only:**
```powershell
npm run server
```

**Frontend only:**
```powershell
npm run client
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### 5. Login

Use these demo credentials to login:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Sales Account:**
- Username: `sales`
- Password: `sales123`

## Features Available

✅ **Dashboard** - Real-time analytics and KPIs
✅ **Vehicle Inventory** - Add, edit, view, and manage vehicles
✅ **Customer Management** - Complete CRM functionality
✅ **Sales Tracking** - Monitor deals and performance
✅ **Service & Appointments** - Schedule and track service appointments
✅ **Reports & Analytics** - Business insights and visualizations

## Technology Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Node.js, Express
- **Database**: In-memory (easily switch to MongoDB)
- **Charts**: MUI X Charts
- **Data Grid**: MUI X Data Grid

## Project Structure

```
AllSync DMS/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── package.json          # Root dependencies
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Service
- `GET /api/service/appointments` - Get all appointments
- `GET /api/service/appointments/:id` - Get single appointment
- `POST /api/service/appointments` - Create appointment
- `PUT /api/service/appointments/:id` - Update appointment
- `DELETE /api/service/appointments/:id` - Delete appointment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity
- `GET /api/dashboard/sales-chart` - Get sales chart data

## Next Steps

### Connect to MongoDB
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. Create Mongoose models
4. Replace in-memory data with database queries

### Add Authentication
1. Implement JWT token generation
2. Add authentication middleware
3. Secure API endpoints
4. Add password hashing with bcrypt

### Deploy to Production
1. Build the frontend: `cd client && npm run build`
2. Set up environment variables on server
3. Configure reverse proxy (nginx)
4. Set up SSL certificate

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use, you can change them:
- Frontend: Create `.env` in `client/` with `PORT=3001`
- Backend: Update `PORT` in root `.env`

### Dependencies Not Installing
Try clearing npm cache:
```powershell
npm cache clean --force
npm install
```

## Support

For issues or questions, refer to the documentation or contact support.

---

**Built with ❤️ for Auto Dealers**
