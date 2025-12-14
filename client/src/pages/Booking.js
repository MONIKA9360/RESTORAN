import React, { useState, useEffect } from 'react';
import { bookingsAPI, tablesAPI } from '../services/api';
import { toast } from 'react-toastify';

const Booking = () => {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    booking_date: '',
    booking_time: '',
    party_size: 1,
    special_requests: '',
    table_id: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingTables, setCheckingTables] = useState(false);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check available tables when date, time, or party size changes
    if (['booking_date', 'booking_time', 'party_size'].includes(name)) {
      const updatedData = { ...formData, [name]: value };
      if (updatedData.booking_date && updatedData.booking_time && updatedData.party_size) {
        checkAvailableTables(updatedData);
      }
    }
  };

  const checkAvailableTables = async (data) => {
    setCheckingTables(true);
    try {
      const response = await tablesAPI.getAvailableTables({
        date: data.booking_date,
        time: data.booking_time,
        party_size: data.party_size
      });
      setAvailableTables(response.data.data);
    } catch (error) {
      console.error('Error checking tables:', error);
      setAvailableTables([]);
    } finally {
      setCheckingTables(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.guest_name || !formData.guest_email || !formData.booking_date || 
          !formData.booking_time || !formData.party_size) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate date is not in the past
      const bookingDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        toast.error('Booking date cannot be in the past');
        return;
      }

      // Convert table_id to number if it exists
      const bookingData = {
        ...formData,
        table_id: formData.table_id ? parseInt(formData.table_id) : null
      };
      
      const response = await bookingsAPI.createBooking(bookingData);
      
      if (response.data.success) {
        toast.success('Booking created successfully! Confirmation email sent.');
        // Reset form
        setFormData({
          guest_name: '',
          guest_email: '',
          guest_phone: '',
          booking_date: '',
          booking_time: '',
          party_size: 1,
          special_requests: '',
          table_id: ''
        });
        setAvailableTables([]);
      }
    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'Failed to create booking';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="container-xxl py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Booking</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Booking</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Booking Section */}
      <div className="container-fluid py-5 px-0 fadeInUp">
        <div className="row g-0 booking-section" style={{ margin: 0, padding: 0 }}>
          <div className="col-md-6">
            <div className="video h-100">
              <img 
                className="img-fluid h-100" 
                src="/img/download.jpg" 
                alt="Restaurant Interior" 
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-md-6 bg-dark d-flex align-items-center">
            <div className="p-5 w-100">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">Reservation</h5>
              <h1 className="text-white mb-4">Book A Table Online</h1>
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="guest_name"
                        name="guest_name"
                        placeholder="Your Name"
                        value={formData.guest_name}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="guest_name">Your Name *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="email" 
                        className="form-control" 
                        id="guest_email"
                        name="guest_email"
                        placeholder="Your Email"
                        value={formData.guest_email}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="guest_email">Your Email *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="tel" 
                        className="form-control" 
                        id="guest_phone"
                        name="guest_phone"
                        placeholder="Your Phone"
                        value={formData.guest_phone}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="guest_phone">Your Phone</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select 
                        className="form-select" 
                        id="party_size"
                        name="party_size"
                        value={formData.party_size}
                        onChange={handleInputChange}
                        required
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'Person' : 'People'}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="party_size">Party Size *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="date" 
                        className="form-control" 
                        id="booking_date"
                        name="booking_date"
                        value={formData.booking_date}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        required
                      />
                      <label htmlFor="booking_date">Date *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        type="time" 
                        className="form-control" 
                        id="booking_time"
                        name="booking_time"
                        value={formData.booking_time}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="booking_time">Time *</label>
                    </div>
                  </div>
                  
                  {/* Available Tables */}
                  {availableTables.length > 0 && (
                    <div className="col-12">
                      <div className="form-floating">
                        <select 
                          className="form-select" 
                          id="table_id"
                          name="table_id"
                          value={formData.table_id}
                          onChange={handleInputChange}
                        >
                          <option value="">Auto-assign table</option>
                          {availableTables.map(table => (
                            <option key={table.id} value={table.id}>
                              Table {table.table_number} - {table.capacity} seats ({table.location})
                            </option>
                          ))}
                        </select>
                        <label htmlFor="table_id">Preferred Table (Optional)</label>
                      </div>
                    </div>
                  )}
                  
                  {checkingTables && (
                    <div className="col-12">
                      <div className="text-white">
                        <i className="fa fa-spinner fa-spin me-2"></i>
                        Checking available tables...
                      </div>
                    </div>
                  )}
                  
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea 
                        className="form-control" 
                        placeholder="Special Requests" 
                        id="special_requests"
                        name="special_requests"
                        style={{ height: '100px' }}
                        value={formData.special_requests}
                        onChange={handleInputChange}
                      ></textarea>
                      <label htmlFor="special_requests">Special Requests</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button 
                      className="btn btn-primary w-100 py-3" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fa fa-spinner fa-spin me-2"></i>
                          Booking...
                        </>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;