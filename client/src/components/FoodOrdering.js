import React, { useState, useEffect } from 'react';
import { supabaseAPI } from '../services/supabaseClient';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const FoodOrdering = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('delivery');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        supabaseAPI.getMenuItems(),
        supabaseAPI.getCategories()
      ]);
      
      setMenuItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === parseInt(selectedCategory));

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast.success(`${item.name} added to cart!`);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrderSubmit = async () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart before ordering');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required customer information');
      return;
    }

    if (orderType === 'delivery' && !customerInfo.address) {
      toast.error('Please provide delivery address');
      return;
    }

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        order_type: orderType,
        delivery_address: orderType === 'delivery' ? customerInfo.address : null,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        })),
        total_amount: getTotalAmount()
      };

      const response = await supabaseAPI.createOrder(orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully! We will contact you soon.');
        setCart([]);
        setCustomerInfo({
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          phone: '',
          address: ''
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center fadeInUp mb-5">
          <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
          <h1 className="mb-5">Order Your Favorite Food</h1>
        </div>

        {/* Order Type Selection */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                name="orderType"
                id="delivery"
                value="delivery"
                checked={orderType === 'delivery'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="delivery">
                <i className="fa fa-truck me-2"></i>Delivery
              </label>

              <input
                type="radio"
                className="btn-check"
                name="orderType"
                id="pickup"
                value="pickup"
                checked={orderType === 'pickup'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="pickup">
                <i className="fa fa-shopping-bag me-2"></i>Pickup
              </label>

              <input
                type="radio"
                className="btn-check"
                name="orderType"
                id="dine-in"
                value="dine-in"
                checked={orderType === 'dine-in'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="dine-in">
                <i className="fa fa-utensils me-2"></i>Dine In
              </label>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group flex-wrap" role="group">
              <button
                type="button"
                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                onClick={() => setSelectedCategory('all')}
              >
                All Items
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  className={`btn ${selectedCategory === category.id.toString() ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          {/* Menu Items */}
          <div className="col-lg-8">
            <div className="row">
              {filteredItems.map(item => (
                <div key={item.id} className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <img
                      src={`/${item.image_url}`}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text flex-grow-1">{item.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="h5 text-primary mb-0">₹{item.price}</span>
                        <button
                          className="btn btn-primary"
                          onClick={() => addToCart(item)}
                          disabled={!item.is_available}
                        >
                          {item.is_available ? (
                            <>
                              <i className="fa fa-plus me-2"></i>Add to Cart
                            </>
                          ) : (
                            'Out of Stock'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart and Order Form */}
          <div className="col-lg-4">
            <div className="card sticky-top">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fa fa-shopping-cart me-2"></i>
                  Your Order ({cart.length} items)
                </h5>
              </div>
              <div className="card-body">
                {cart.length === 0 ? (
                  <p className="text-muted text-center">Your cart is empty</p>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {cart.map(item => (
                        <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div className="flex-grow-1">
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-muted">₹{item.price} each</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-top pt-3 mb-3">
                      <div className="d-flex justify-content-between">
                        <strong>Total: ₹{getTotalAmount().toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="mb-3">
                      <h6>Customer Information</h6>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Full Name *"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          placeholder="Email *"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          placeholder="Phone Number *"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          required
                        />
                      </div>
                      {orderType === 'delivery' && (
                        <div className="mb-2">
                          <textarea
                            className="form-control form-control-sm"
                            placeholder="Delivery Address *"
                            rows="2"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            required
                          ></textarea>
                        </div>
                      )}
                    </div>

                    {/* Place Order Button */}
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleOrderSubmit}
                    >
                      <i className="fa fa-check me-2"></i>
                      Place Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodOrdering;