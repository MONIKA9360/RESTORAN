-- Fix RLS policies to allow anonymous bookings
-- Run this in your Supabase SQL editor

-- Drop existing booking policies
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Create new policies that allow anonymous bookings
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can update bookings" ON bookings FOR UPDATE USING (true);

-- Also allow anonymous contact messages (already exists but making sure)
DROP POLICY IF EXISTS "Anyone can send contact messages" ON contact_messages;
CREATE POLICY "Anyone can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view contact messages" ON contact_messages FOR SELECT USING (true);