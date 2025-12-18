const express = require('express');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const supabase = req.supabase;
    
    const { data: items, error: itemsError } = await supabase
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

    if (itemsError) throw itemsError;

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu data'
    });
  }
});

// Get all menu categories
router.get('/categories', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order');

    if (categoriesError) throw categoriesError;

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get menu with categories and items grouped
router.get('/grouped', async (req, res) => {
  try {
    const supabase = req.supabase;
    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order');

    if (categoriesError) throw categoriesError;

    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('id');

    if (itemsError) throw itemsError;

    // Group items by category
    const menuData = categories.map(category => ({
      ...category,
      items: items.filter(item => item.category_id === category.id)
    }));

    res.json({
      success: true,
      data: menuData
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu data'
    });
  }
});

// Get menu items by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const supabase = req.supabase;
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_available', true)
      .order('id');

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items'
    });
  }
});

// Get single menu item
router.get('/item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const supabase = req.supabase;
    
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories (
          id,
          name
        )
      `)
      .eq('id', itemId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item'
    });
  }
});

module.exports = router;