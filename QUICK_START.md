# 🚗 AllSync DMS - Quick Reference

## ✅ Application Status

**Backend Server**: Running on http://localhost:5000
**Frontend App**: Running on http://localhost:3000

## 🔐 Demo Login Credentials

### Admin Account (Full Access)
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator
- **Email**: admin@allsync.us

### Sales Account (Sales Access)
- **Username**: `sales`
- **Password**: `sales123`
- **Role**: Sales Manager
- **Email**: sales@allsync.us

## 📱 Main Features

### 1. Dashboard
- Real-time KPIs and metrics
- Sales performance charts
- Recent activity feed
- Quick overview statistics

### 2. Vehicle Inventory
- Add/Edit/Delete vehicles
- Search and filter inventory
- Track vehicle details (VIN, make, model, price, etc.)
- Manage vehicle status (Available, Sold, Pending)

### 3. Customer Management (CRM)
- Customer database
- Contact information
- Customer status tracking
- Purchase history

### 4. Sales Management
- Create and track deals
- Monitor sales pipeline
- Finance information
- Sales performance tracking

### 5. Service & Appointments
- Schedule service appointments
- Track repair orders
- Service history
- Appointment status management

### 6. Reports & Analytics
- Sales reports and charts
- Inventory analytics
- Performance metrics
- Top performers tracking

## 🛠️ Common Tasks

### Start the Application
```powershell
npm run dev
```

### Stop the Application
Press `Ctrl+C` in the terminal

### Restart Servers
Backend: Type `rs` in the terminal
Frontend: `Ctrl+C` then `npm run client`

### View API Directly
Visit: http://localhost:5000/api/health

### Clear Browser Cache
Press `Ctrl+Shift+Delete` in your browser

## 📂 Key Files

- **Backend API**: `server/index.js`
- **API Routes**: `server/routes/*.js`
- **Frontend App**: `client/src/App.tsx`
- **Pages**: `client/src/pages/*.tsx`
- **Layout**: `client/src/components/Layout.tsx`

## 🔧 Customization Ideas

1. **Add MongoDB**: Replace in-memory data with database
2. **JWT Authentication**: Implement secure token-based auth
3. **File Uploads**: Add vehicle image upload functionality
4. **Email Notifications**: Send notifications for appointments
5. **Advanced Filtering**: Add more search and filter options
6. **Export Reports**: Add PDF/Excel export functionality
7. **User Roles**: Implement role-based permissions
8. **Multi-language**: Add internationalization support

## 🚀 Deployment

### Build for Production
```powershell
cd client
npm run build
```

### Environment Variables
Create `.env` file with:
- `PORT` - Server port
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication secret
- `NODE_ENV` - Environment (production/development)

## 📊 Sample Data

The application comes with pre-populated sample data:
- **3 Vehicles** (Toyota Camry, Tesla Model 3, Jeep Wrangler)
- **2 Customers** (John Smith, Sarah Johnson)
- **2 Sales** (Completed and Pending)
- **2 Service Appointments** (Scheduled and In Progress)

## 🆘 Troubleshooting

### Port Already in Use
Change port in `.env` or kill the process

### React App Not Loading
Check console for errors, clear cache, restart

### API Not Responding
Ensure backend is running on port 5000

### Database Errors
Currently using in-memory data (no database required)

## 📝 Next Steps

1. ✅ Login to the application
2. ✅ Explore the dashboard
3. ✅ Add a new vehicle to inventory
4. ✅ Create a customer record
5. ✅ Record a sale
6. ✅ Schedule a service appointment
7. ✅ View reports and analytics

---

**Happy Selling! 🎉**
