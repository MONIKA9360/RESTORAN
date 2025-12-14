# Restaurant Full-Stack Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Step 1: Supabase Setup

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Schema:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the content from `database/schema.sql`
   - Run the SQL script

3. **Configure Authentication:**
   - Go to Authentication > Settings
   - Enable email authentication
   - Configure email templates if needed

## Step 2: Environment Variables

1. **Server Environment:**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

2. **Client Environment:**
   ```bash
   cd client
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_URL=http://localhost:5000
   ```

## Step 3: Install Dependencies

From the root directory:
```bash
npm run install-all
```

Or manually:
```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

## Step 4: Copy Static Assets

Copy the images from the original template to the React public folder:

```bash
# Create img directory in client/public
mkdir -p client/public/img

# Copy images from original template
cp "Restoran Free Website Template - Free-CSS.com/bootstrap-restaurant-template/img/"* client/public/img/
```

## Step 5: Run the Application

### Development Mode (Both servers):
```bash
npm run dev
```

### Or run separately:

**Backend Server:**
```bash
cd server
npm run dev
```

**Frontend Client:**
```bash
cd client
npm start
```

## Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Step 7: Test the Application

1. **Register a new user**
2. **Browse the menu**
3. **Make a booking**
4. **Check your bookings**
5. **Send a contact message**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:id` - Get items by category
- `GET /api/menu/item/:id` - Get single item

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get bookings (with filters)
- `GET /api/bookings/:id` - Get single booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Tables
- `GET /api/tables` - Get all tables
- `GET /api/tables/available` - Get available tables
- `GET /api/tables/:id` - Get single table
- `GET /api/tables/:id/bookings` - Get table bookings

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get contact messages
- `PATCH /api/contact/:id/read` - Mark message as read
- `DELETE /api/contact/:id` - Delete message

## Database Tables

- `profiles` - User profiles
- `menu_categories` - Menu categories
- `menu_items` - Menu items
- `restaurant_tables` - Restaurant tables
- `bookings` - Table bookings
- `contact_messages` - Contact form messages

## Features

✅ User authentication (register/login)  
✅ Menu display with categories  
✅ Table booking system  
✅ Available table checking  
✅ User profile management  
✅ Booking history  
✅ Contact form  
✅ Responsive design  
✅ Real-time data with Supabase  
✅ Form validation  
✅ Error handling  
✅ Loading states  

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check FRONTEND_URL in server .env
   - Ensure ports are correct

2. **Database Connection:**
   - Verify Supabase credentials
   - Check if schema was run correctly

3. **Images Not Loading:**
   - Ensure images are copied to client/public/img/
   - Check image paths in components

4. **Authentication Issues:**
   - Verify Supabase auth settings
   - Check JWT configuration

### Logs:
- Server logs: Check terminal running server
- Client logs: Check browser console
- Database logs: Check Supabase dashboard

## Production Deployment

### Backend (Node.js):
- Deploy to Heroku, Railway, or similar
- Set production environment variables
- Update CORS settings

### Frontend (React):
- Build: `cd client && npm run build`
- Deploy to Netlify, Vercel, or similar
- Update API_URL to production backend

### Database:
- Supabase handles production database
- Update RLS policies if needed
- Monitor usage and performance

## Support

For issues or questions:
- Check the logs first
- Verify environment variables
- Test API endpoints directly
- Check Supabase dashboard for database issues