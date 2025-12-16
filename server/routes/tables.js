const express = require('express');
const router = express.Router();

// Get all tables
router.get('/', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { location, capacity, available_only } = req.query;

    let query = supabase
      .from('restaurant_tables')
      .select('*')
      .order('table_number');

    // Apply filters
    if (location) {
      query = query.eq('location', location);
    }
    if (capacity) {
      query = query.gte('capacity', parseInt(capacity));
    }
    if (available_only === 'true') {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tables'
    });
  }
});

// Get available tables for specific date/time
router.get('/available', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { date, time, party_size } = req.query;

    if (!date || !time || !party_size) {
      return res.status(400).json({
        success: false,
        error: 'Date, time, and party_size are required'
      });
    }

    // Get all tables that can accommodate the party size
    const { data: allTables, error: tablesError } = await supabase
      .from('restaurant_tables')
      .select('*')
      .gte('capacity', parseInt(party_size))
      .eq('is_available', true)
      .order('capacity');

    if (tablesError) throw tablesError;

    // Get bookings for the requested date and time (within 1 hour window)
    const requestedDateTime = new Date(`${date}T${time}`);
    const oneHourBefore = new Date(requestedDateTime.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(requestedDateTime.getTime() + 60 * 60 * 1000);

    const { data: bookedTables, error: bookingsError } = await supabase
      .from('bookings')
      .select('table_id')
      .eq('booking_date', date)
      .gte('booking_time', oneHourBefore.toTimeString().slice(0, 5))
      .lte('booking_time', oneHourAfter.toTimeString().slice(0, 5))
      .neq('status', 'cancelled');

    if (bookingsError) throw bookingsError;

    // Filter out booked tables
    const bookedTableIds = bookedTables.map(booking => booking.table_id);
    const availableTables = allTables.filter(table => !bookedTableIds.includes(table.id));

    res.json({
      success: true,
      data: availableTables
    });

  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available tables'
    });
  }
});

// Get single table
router.get('/:id', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch table'
    });
  }
});

// Get table bookings
router.get('/:id/bookings', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;
    const { date } = req.query;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        restaurant_tables (
          table_number,
          capacity
        )
      `)
      .eq('table_id', id)
      .neq('status', 'cancelled')
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false });

    if (date) {
      query = query.eq('booking_date', date);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Error fetching table bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch table bookings'
    });
  }
});

module.exports = router;