import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div>
      {/* Hero Header */}
      <div className="container-xxl py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Services</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Services</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Service Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center fadeInUp mb-5">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Our Services</h5>
            <h1 className="mb-5">Explore Our Services</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 fadeInUp">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                  <h5>Master Chefs</h5>
                  <p>
                    Meet the heart of our kitchen: our Master Chefs. They are culinary artisans, 
                    bringing passion and precision to every dish, ensuring your dining experience is truly unforgettable.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 fadeInUp">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                  <h5>Quality Food</h5>
                  <p>
                    Our commitment to quality food is unwavering. We hand-select the best produce, 
                    meats, and seafood, ensuring every plate served is a testament to our dedication to excellence.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 fadeInUp">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-cart-plus text-primary mb-4"></i>
                  <h5>Online Order</h5>
                  <p>
                    Enjoy your Restoran favorites from the comfort of your home! Our online ordering system 
                    makes it incredibly easy to browse our full menu and place your order.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 fadeInUp">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                  <h5>24/7 Service</h5>
                  <p>
                    Hungry anytime? We're always open! Enjoy your favorite Restoran dishes 
                    24 hours a day, for every craving, day or night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-100 fadeInUp" src="/img/about-1.jpg" alt="Service 1" />
                </div>
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-75 fadeInUp" src="/img/about-2.jpg" alt="Service 2" style={{ marginTop: '25%' }} />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-75 fadeInUp" src="/img/about-3.jpg" alt="Service 3" />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-100 fadeInUp" src="/img/about-4.jpg" alt="Service 4" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">Why Choose Us</h5>
              <h1 className="mb-4">What Makes Us Special</h1>
              
              <div className="row g-4">
                <div className="col-12">
                  <div className="d-flex">
                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary" style={{ width: '65px', height: '65px' }}>
                      <i className="fa fa-2x fa-check text-white"></i>
                    </div>
                    <div className="ms-4">
                      <h5>Fresh Ingredients</h5>
                      <p className="mb-0">We source only the freshest ingredients from local suppliers to ensure the highest quality in every dish.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex">
                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary" style={{ width: '65px', height: '65px' }}>
                      <i className="fa fa-2x fa-check text-white"></i>
                    </div>
                    <div className="ms-4">
                      <h5>Expert Chefs</h5>
                      <p className="mb-0">Our team of experienced chefs brings years of culinary expertise to create memorable dining experiences.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex">
                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-primary" style={{ width: '65px', height: '65px' }}>
                      <i className="fa fa-2x fa-check text-white"></i>
                    </div>
                    <div className="ms-4">
                      <h5>Excellent Service</h5>
                      <p className="mb-0">Our friendly and professional staff is dedicated to providing exceptional service that exceeds your expectations.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link className="btn btn-primary py-3 px-5 mt-4" to="/booking">Book A Table</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;