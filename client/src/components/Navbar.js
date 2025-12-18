import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
      <Link to="/" className="navbar-brand p-0">
        <h1 className="text-primary m-0">
          <i className="fa fa-utensils me-3"></i>Restoran
        </h1>
      </Link>
      
      <button 
        className="navbar-toggler" 
        type="button" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        <span className="fa fa-bars"></span>
      </button>
      
      <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}>
        <div className="navbar-nav ms-auto py-0 pe-4">
          <Link 
            to="/" 
            className={`nav-item nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-item nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            About
          </Link>
          <Link 
            to="/services" 
            className={`nav-item nav-link ${isActive('/services') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            Services
          </Link>
          <Link 
            to="/menu" 
            className={`nav-item nav-link ${isActive('/menu') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            Menu
          </Link>
          <Link 
            to="/order" 
            className={`nav-item nav-link ${isActive('/order') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            Order Food
          </Link>
          <Link 
            to="/booking" 
            className={`nav-item nav-link ${isActive('/booking') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            Booking
          </Link>
          <Link 
            to="/contact" 
            className={`nav-item nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            Contact
          </Link>
          

        </div>
        
        <Link 
          to="/booking" 
          className="btn btn-primary py-2 px-4"
          onClick={() => setIsCollapsed(true)}
        >
          Book A Table
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;