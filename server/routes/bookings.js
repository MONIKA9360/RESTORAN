const express = require('express');
const Joi = require('joi');
const router = express.Router();

// Import email service
const { sendBookingEmails } = require('../services/emailService');

// Validation schema for booking
const bookingSchema = Joi.object({
  guest_name: Joi.string().required().min(2).max(100),
  guest_email: Joi.string().email().required(),
  guest_phone: Joi.string().optional().allow(''),
  booking_date: Joi.date().required(),
  booking_time: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  party_size: Joi.number().integer().min(1).max(20).required(),
  special_requests: Joi.string().optional().allow('').max(500),
  table_id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().allow(''),
    Joi.allow(null)
  ).optional()
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const supabase = req.supabase;
    
    // Validate input
    const { error: validationError, value } = bookingSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError.details[0].message
      });
    }

    const bookingData = value;

    // Convert table_id to number if it's a string, or set to null if empty
    if (bookingData.table_id) {
      bookingData.table_id = parseInt(bookingData.table_id);
    } else {
      bookingData.table_id = null;
    }

    // Ensure date is in correct format
    if (bookingData.booking_date) {
      bookingData.booking_date = new Date(bookingData.booking_date).toISOString().split('T')[0];
    }

    // If no table specified, find an available table
    if (!bookingData.table_id) {
      const { data: availableTables, error: tableError } = await supabase
        .from('restaurant_tables')
        .select('id')
        .gte('capacity', bookingData.party_size)
        .eq('is_available', true)
        .order('capacity')
        .limit(1);

      if (tableError) throw tableError;

      if (!availableTables || availableTables.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No available tables for the requested party size'
        });
      }

      bookingData.table_id = availableTables[0].id;
    }

    // Check if table is available at the requested time
    const requestedDateTime = new Date(`${bookingData.booking_date}T${bookingData.booking_time}`);
    const oneHourBefore = new Date(requestedDateTime.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(requestedDateTime.getTime() + 60 * 60 * 1000);

    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('table_id', bookingData.table_id)
      .eq('booking_date', bookingData.booking_date)
      .gte('booking_time', oneHourBefore.toTimeString().slice(0, 5))
      .lte('booking_time', oneHourAfter.toTimeString().slice(0, 5))
      .neq('status', 'cancelled');

    if (conflictError) throw conflictError;

    if (conflictingBookings && conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Table is not available at the requested time'
      });
    }

    // Set user_id to null since we don't have authentication
    bookingData.user_id = null;

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Send email notifications
    try {
      await sendBookingEmails(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// Get all bookings (with optional filters)
router.get('/', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { date, status, email } = req.query;
    
    let query = supabase
      .from('bookings')
      .select(`
        *,
        restaurant_tables (
          table_number,
          capacity,
          location
        )
      `)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false });

    // Apply filters
    if (date) {
      query = query.eq('booking_date', date);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (email) {
      query = query.eq('guest_email', email);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        restaurant_tables (
          table_number,
          capacity,
          location
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data,
      message: `Booking ${status} successfully`
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking'
    });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
});

module.exports = router;