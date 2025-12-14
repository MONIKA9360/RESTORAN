# Restaurant Full-Stack Application

A modern restaurant booking system built with React, Node.js, and Supabase.

## Features

- 🍽️ Restaurant menu display
- 📅 Table booking system
- 👤 User authentication
- 📊 Admin dashboard
- 💾 Supabase database integration
- 📱 Responsive design

## Tech Stack

### Frontend
- React.js
- Bootstrap 5
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- Supabase client
- CORS enabled

### Database
- Supabase (PostgreSQL)

## Project Structure

```
restaurant-fullstack/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── database/              # Database schema and setup
└── docs/                  # Documentation
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Setup Supabase:**
   - Create a Supabase project
   - Copy your project URL and anon key
   - Update environment variables

3. **Run the application:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create `.env` files in both client and server directories:

### Server (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

### Client (.env)
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000
```

## Database Schema

The application uses the following main tables:
- `users` - User authentication and profiles
- `bookings` - Table reservations
- `menu_items` - Restaurant menu
- `tables` - Restaurant table management

## API Endpoints

- `GET /api/menu` - Get menu items
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request