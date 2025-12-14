-- Restaurant Full-Stack Database Schema
-- Run this in your Supabase SQL editor

-- Note: JWT secret is automatically managed by Supabase

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu categories
CREATE TABLE public.menu_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items
CREATE TABLE public.menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant tables
CREATE TABLE public.restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number INTEGER UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    location TEXT, -- 'indoor', 'outdoor', 'private'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE public.bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    table_id INTEGER REFERENCES restaurant_tables(id),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages
CREATE TABLE public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Breakfast', 'Start your day with our delicious breakfast items', 1),
('Lunch', 'Special lunch offerings', 2),
('Dinner', 'Exquisite dinner selections', 3),
('Beverages', 'Refreshing drinks and beverages', 4);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, image_url) VALUES
-- Breakfast items
(1, 'Burrito', 'A hearty and satisfying breakfast wrapped in a warm flour tortilla. Packed with classic morning favorites, it''s a perfect on-the-go meal.', 100.00, 'img/menu-1.jpg'),
(1, 'Bread Pakora', 'An Indian fried snack featuring spiced gram flour-coated bread slices. This popular street food is a delightful savory treat.', 120.00, 'img/menu-2.jpg'),
(1, 'Sandwich', 'A versatile breakfast classic, featuring various morning ingredients layered between slices of bread. Perfect for a quick and customizable meal.', 100.00, 'img/menu-3.jpg'),
(1, 'French Toast', 'Sliced bread soaked in a rich egg and milk batter, then pan-fried to golden perfection. Enjoy this sweet and comforting dish with your favorite toppings.', 150.00, 'img/menu-4.jpg'),
(1, 'Poha', 'A traditional South Asian dish made from flattened rice flakes. Light, fluffy, and often seasoned with spices and vegetables, it''s a wholesome breakfast option.', 170.00, 'img/menu-5.jpg'),
(1, 'Aloo Paratha', 'A delicious North Indian flatbread stuffed with a flavorful mixture of spiced mashed potatoes. Traditionally enjoyed for breakfast with butter or ghee.', 100.00, 'img/menu-6.jpg'),
(1, 'Vada Pav', 'A beloved vegetarian fast food from Maharashtra, India. It consists of a deep-fried potato dumpling nestled within a soft bread bun.', 120.00, 'img/menu-7.jpg'),
(1, 'Waffles', 'Golden, crispy, and fluffy, these delicious grids are made from a simple batter. A versatile and delightful breakfast or brunch item', 150.00, 'img/menu-8.jpg'),

-- Lunch items
(2, 'Rajma', 'A hearty and flavorful North Indian curry made with red kidney beans. Enjoy this comforting and protein-rich dish, perfect with rice or bread.', 100.00, 'img/menu-9.jpg'),
(2, 'Soup', 'Warm your soul with our comforting soup. Crafted with fresh ingredients, it''s the perfect start to any meal or a light, satisfying option on its own', 120.00, 'img/menu-10.jpg'),
(2, 'Wrap', 'A delightful and convenient meal, featuring your choice of savory fillings tightly wrapped in a soft tortilla. Customize it to your taste for a fresh and satisfying bite.', 150.00, 'img/menu-11.jpg'),
(2, 'Avocado', 'Enjoy the creamy, rich goodness of fresh avocado. A versatile and healthy addition, perfect as a side or integrated into your favorite dishes', 250.00, 'img/menu-12.jpg'),
(2, 'Tehri Recipe', 'Experience the aromatic delight of Tehri, a flavorful rice dish cooked with vegetables and spices. A wholesome and satisfying meal, perfect for any time of day.', 180.00, 'img/menu-13.jpg'),
(2, 'Masala Bhindi', 'Delicious pan-fried okra (bhindi) tossed in a vibrant blend of aromatic Indian spices. A delightful and popular vegetarian side dish.', 150.00, 'img/menu-14.jpg'),
(2, 'Gujarati Kadhi', 'Savor the unique flavors of Gujarati Kadhi, a sweet and tangy yogurt-based curry. Light, comforting, and a perfect accompaniment to rice.', 120.00, 'img/menu-15.jpg'),
(2, 'Salad', 'Fresh, crisp, and vibrant, our salads are crafted with the finest seasonal produce. A healthy and refreshing choice to complement your meal.', 120.00, 'img/menu-16.jpg'),

-- Dinner items
(3, 'Palak Paneer', 'A classic Indian delicacy featuring soft cubes of paneer (Indian cheese) simmered in a rich, creamy spinach gravy. A wholesome and flavorful vegetarian favorite.', 120.00, 'img/menu-17.jpg'),
(3, 'Dal Fry', 'A comforting and popular lentil dish, our Dal Fry is made with tender cooked lentils tempered with aromatic spices, onions, and tomatoes. Perfect with rice or bread.', 150.00, 'img/menu-18.jpg'),
(3, 'Matar Paneer', 'A delicious and widely loved North Indian curry combining tender green peas (matar) and soft paneer cubes in a rich, flavorful tomato-based gravy.', 120.00, 'img/menu-19.jpg'),
(3, 'Chana Masala', 'A robust and tangy North Indian curry made with chickpeas (chana) cooked in a vibrant blend of spices, onions, and tomatoes. A hearty and satisfying vegetarian delight.', 150.00, 'img/menu-20.jpg'),
(3, 'Paneer Curry', 'Experience our delightful Paneer Curry, featuring succulent cubes of Indian cheese simmered in a rich and aromatic gravy. A versatile and deeply satisfying vegetarian option.', 180.00, 'img/menu-21.jpg'),
(3, 'Veg Pulao', 'A fragrant and flavorful rice dish cooked with mixed vegetables and aromatic spices. Our Veg Pulao is a light yet satisfying meal on its own or a great accompaniment.', 120.00, 'img/menu-22.jpg'),
(3, 'Sambar', 'A South Indian staple, our Sambar is a tangy and spicy lentil-based vegetable stew. Perfect with idli, dosa, or rice, offering a burst of authentic flavors.', 100.00, 'img/menu-23.jpg'),
(3, 'Rajma', 'A hearty and comforting North Indian curry made with red kidney beans, slow-cooked in a rich tomato-based gravy with aromatic spices. A wholesome and deeply satisfying dish.', 120.00, 'img/menu-24.jpg');

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
(10, 12, 'private');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Bookings: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for menu items and categories
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view available tables" ON restaurant_tables FOR SELECT USING (true);

-- Contact messages: Anyone can insert, only authenticated users can view
CREATE POLICY "Anyone can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();