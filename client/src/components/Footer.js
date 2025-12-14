import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="container-fluid bg-dark text-light footer pt-5 mt-5">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
              Company
            </h4>
            <Link className="btn btn-link" to="/about">About Us</Link>
            <Link className="btn btn-link" to="/contact">Contact Us</Link>
            <Link className="btn btn-link" to="/booking">Reservation</Link>
            <Link className="btn btn-link" to="/services">Services</Link>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
              Contact
            </h4>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt me-3"></i>
              20/41, Kaaliannan extension, Gobi
            </p>
            <p className="mb-2">
              <i className="fa fa-phone-alt me-3"></i>
              +91 9876543210
            </p>
            <p className="mb-2">
              <i className="fa fa-envelope me-3"></i>
              monikam11g1@gmail.com
            </p>
            <div className="d-flex pt-2">
              <a className="btn btn-outline-light btn-social" href="https://github.com/MONIKA9360">
                <i className="fab fa-github"></i>
              </a>
              <a className="btn btn-outline-light btn-social" href="https://www.linkedin.com/in/monika-m-00515a292">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a className="btn btn-outline-light btn-social" href="https://www.instagram.com/mooness_flower?igsh=MWt5b3E3c3pjb2RuYQ==">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
              Opening Hours
            </h4>
            <h5 className="text-light fw-normal">Monday - Saturday</h5>
            <p>09AM - 09PM</p>
            <h5 className="text-light fw-normal">Sunday</h5>
            <p>10AM - 08PM</p>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
              Newsletter
            </h4>
            <p>Defining flavor, one moment at a time.</p>
            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
              <input 
                className="form-control border-primary w-100 py-3 ps-4 pe-5" 
                type="text" 
                placeholder="Your email"
              />
              <button 
                type="button" 
                className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
              >
                SignUp
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <Link className="border-bottom" to="/">Restoran</Link>, All Right Reserved.
              <br />
              Designed By Monika M
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <Link to="/">Home</Link>
                <Link to="/menu">Menu</Link>
                <Link to="/contact">Help</Link>
                <Link to="/contact">FAQs</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;