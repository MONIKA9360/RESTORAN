-- Food Ordering System Extension
-- Add these tables to your existing schema for food ordering functionality

-- Orders table
CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    order_type TEXT NOT NULL DEFAULT 'delivery', -- 'delivery', 'pickup', 'dine-in'
    delivery_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    payment_method TEXT, -- 'cash', 'card', 'upi', 'online'
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart table (for temporary storage before order)
CREATE TABLE public.cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    session_id TEXT, -- For guest users
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery zones table
CREATE TABLE public.delivery_zones (
    id SERIAL PRIMARY KEY,
    zone_name TEXT NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    minimum_order DECIMAL(10,2) NOT NULL DEFAULT 0,
    delivery_time_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Order Items
CREATE POLICY "Users can view own order items" ON order_items 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create order items" ON order_items 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- RLS Policies for Cart Items
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Public read access for delivery zones
CREATE POLICY "Anyone can view delivery zones" ON delivery_zones FOR SELECT USING (is_active = true);

-- Insert sample delivery zones
INSERT INTO delivery_zones (zone_name, delivery_fee, minimum_order, delivery_time_minutes) VALUES
('City Center', 50.00, 200.00, 30),
('Suburbs', 80.00, 300.00, 45),
('Outskirts', 120.00, 500.00, 60);

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id_param INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(total_price), 0) INTO total
    FROM order_items
    WHERE order_id = order_id_param;
    
    UPDATE orders 
    SET total_amount = total, updated_at = NOW()
    WHERE id = order_id_param;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to update order total when items are added/updated
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_order_total(OLD.order_id);
        RETURN OLD;
    ELSE
        PERFORM calculate_order_total(NEW.order_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update order total
CREATE TRIGGER trigger_update_order_total
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_order_total();

-- Function to clear cart after order
CREATE OR REPLACE FUNCTION clear_user_cart(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM cart_items WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;