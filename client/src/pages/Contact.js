import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../services/api';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await contactAPI.sendMessage(formData);
      
      if (response.data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="container-xxl py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Contact Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center fadeInUp mb-5">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
            <h1 className="mb-5">Contact For Any Query</h1>
          </div>
          <div className="row g-4">
            <div className="col-12">
              <div className="row gy-4">
                <div className="col-md-4">
                  <h5 className="section-title ff-secondary fw-normal text-start text-primary">Booking</h5>
                  <p><i className="fa fa-envelope-open text-primary me-2"></i>monikam11g1@gmail.com</p>
                </div>
                <div className="col-md-4">
                  <h5 className="section-title ff-secondary fw-normal text-start text-primary">General</h5>
                  <p><i className="fa fa-envelope-open text-primary me-2"></i>info@restoran.com</p>
                </div>
                <div className="col-md-4">
                  <h5 className="section-title ff-secondary fw-normal text-start text-primary">Technical</h5>
                  <p><i className="fa fa-envelope-open text-primary me-2"></i>tech@restoran.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 fadeInUp">
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                frameBorder="0"
                style={{ minHeight: '400px', border: '0', width: '100%', height: '400px' }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                title="Restaurant Location"
                loading="eager"
              ></iframe>
            </div>
            <div className="col-md-6">
              <div className="fadeInUp">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Leave a message here"
                          id="message"
                          name="message"
                          style={{ height: '150px' }}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                        <label htmlFor="message">Message</label>
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
                            Sending Message...
                          </>
                        ) : (
                          'Send Message'
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
    </div>
  );
};

export default Contact;