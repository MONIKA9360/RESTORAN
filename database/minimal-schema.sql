-- Minimal Database Schema for Restaurant Booking
-- Run this in Supabase SQL Editor

-- Restaurant tables
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number INTEGER UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    location TEXT DEFAULT 'indoor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID DEFAULT NULL,
    table_id INTEGER REFERENCES restaurant_tables(id),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample restaurant tables
INSERT INTO restaurant_tables (table_number, capacity, location) VALUES
(1, 2, 'indoor'),
(2, 4, 'indoor'),
(3, 6, 'indoor'),
(4, 8, 'indoor'),
(5, 2, 'outdoor'),
(6, 4, 'outdoor'),
(7, 6, 'outdoor'),
(8, 4, 'private'),
(9, 8, 'private'),
(10, 12, 'private')
ON CONFLICT (table_number) DO NOTHING;

-- Enable public access (disable RLS for now)
ALTER TABLE restaurant_tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;