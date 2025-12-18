import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Direct Supabase operations
export const supabaseAPI = {
  // Menu operations
  async getMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories (
          id,
          name
        )
      `)
      .eq('is_available', true)
      .order('id');
    
    if (error) throw error;
    return { data };
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return { data };
  },

  // Booking operations
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) throw error;
    return { data: { success: true, data } };
  },

  async getAvailableTables(params) {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('is_available', true);
    
    if (error) throw error;
    return { data };
  },

  // Contact operations
  async sendContactMessage(messageData) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) throw error;
    return { data: { success: true, data } };
  },

  // Order operations
  async createOrder(orderData) {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.user_id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        order_type: orderData.order_type,
        delivery_address: orderData.delivery_address,
        total_amount: orderData.total_amount,
        special_instructions: orderData.special_instructions
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      special_requests: item.special_requests
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return { data: { success: true, data: order } };
  }
};

export default supabase;