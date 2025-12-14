const express = require('express');
const Joi = require('joi');
const { sendContactEmail } = require('../services/emailService');
const router = express.Router();

// Validation schema for contact message
const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  subject: Joi.string().optional().allow('').max(200),
  message: Joi.string().required().min(10).max(1000)
});

// Submit contact message
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error: validationError, value } = contactSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError.details[0].message
      });
    }

    const contactData = value;

    // Get supabase from request
    const supabase = req.supabase;
    
    // Save to database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([contactData])
      .select()
      .single();

    if (error) throw error;

    // Send email notification
    try {
      await sendContactEmail(data);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the contact form if email fails
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Message sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { page = 1, limit = 10, is_read } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by read status if provided
    if (is_read !== undefined) {
      query = query.eq('is_read', is_read === 'true');
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// Mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update message'
    });
  }
});

// Delete contact message
router.delete('/:id', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { id } = req.params;

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

module.exports = router;