const express = require('express');
const router = express.Router();
const { supabase } = require('../services/supabase');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      order_type = 'delivery',
      delivery_address,
      items,
      total_amount,
      special_instructions
    } = req.body;

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customer_name, customer_email, customer_phone, and items'
      });
    }

    // Validate delivery address for delivery orders
    if (order_type === 'delivery' && !delivery_address) {
      return res.status(400).json({
        success: false,
        error: 'Delivery address is required for delivery orders'
      });
    }

    // Get user ID if authenticated
    const user_id = req.user?.id || null;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        order_type,
        delivery_address,
        total_amount,
        special_instructions,
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }

    // Create order items
    const orderItems = items.map(item => ({
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
      console.error('Order items creation error:', itemsError);
      // Rollback: delete the order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id);
      return res.status(500).json({
        success: false,
        error: 'Failed to create order items'
      });
    }

    // Clear user's cart if authenticated
    if (user_id) {
      await supabase.from('cart_items').delete().eq('user_id', user_id);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order_id: order.id,
        order_number: `ORD-${order.id.toString().padStart(6, '0')}`,
        status: order.status,
        total_amount: order.total_amount,
        estimated_delivery_time: order.estimated_delivery_time
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { status, limit = 10, offset = 0 } = req.query;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch orders'
      });
    }

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            name,
            description,
            image_url
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error('Order fetch error:', error);
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user?.id;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    // Only allow users to cancel their own orders
    if (status === 'cancelled') {
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (fetchError || !order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Only pending orders can be cancelled'
        });
      }
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Order update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update order'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Cancel order (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    // Check if order exists and belongs to user
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending orders can be cancelled'
      });
    }

    // Update order status to cancelled instead of deleting
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Order cancellation error:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to cancel order'
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;