import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // Scroll-triggered counter animation
    const handleScroll = () => {
      const aboutSection = document.querySelector('.about-section');
      const counters = document.querySelectorAll('.counter');
      
      if (aboutSection && counters.length > 0) {
        const sectionTop = aboutSection.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Trigger animation when about section comes into view
        if (scrollPosition > sectionTop + 100 && !aboutSection.dataset.animated) {
          aboutSection.dataset.animated = 'true';
          
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const start = parseInt(counter.textContent);
            const increment = (target - start) / 100;
            let current = start;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, 20);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Navbar & Hero Start */}
      <div className="container-xxl position-relative p-0">
        <div 
          className="container-xxl py-5 bg-dark hero-header mb-5"
          style={{
            background: 'linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(/img/bg-hero.jpg)',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <div className="container my-5 py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 text-center text-lg-start">
                <h1 className="display-3 text-white animated slideInLeft">Enjoy Our<br />Delicious Meal</h1>
                <p className="text-white animated slideInLeft mb-4 pb-2">Welcome to Restoran, where we craft delicious food and memorable moments, ensuring every visit is a delightful experience.</p>
                <Link to="/booking" className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft">Book A Table</Link>
              </div>
              <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                <img className="img-fluid hero-rotate" src="/img/hero.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navbar & Hero End */}

      {/* Service Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 fadeInUp">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                  <h5>Master Chefs</h5>
                  <p>
                    Meet the heart of our kitchen: our Master Chefs. They are culinary artisans, 
                    bringing passion and precision to every dish.
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
                    meats, and seafood for excellence.
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
                    Enjoy your Restoran favorites from home! Our online ordering system makes it 
                    easy to browse and order.
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
                    24 hours a day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container-xxl py-5 about-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-100" src="/img/about-1.jpg" alt="About 1" />
                </div>
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-75" src="/img/about-2.jpg" alt="About 2" style={{ marginTop: '25%' }} />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-75" src="/img/about-3.jpg" alt="About 3" />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-100" src="/img/about-4.jpg" alt="About 4" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
              <h1 className="mb-4">Welcome to <i className="fa fa-utensils text-primary me-2"></i>Restoran</h1>
              <p className="mb-4">
                Welcome to Restoran, where every detail is crafted for your enjoyment. We offer a dining 
                experience that is both sophisticated and inviting.
              </p>
              <p className="mb-4">
                Our culinary team is dedicated to creating exquisite dishes that tantalize your taste buds 
                and leave you with unforgettable memories.
              </p>
              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                    <h1 className="flex-shrink-0 display-5 text-primary mb-0 counter" data-target="25">10</h1>
                    <div className="ps-4">
                      <p className="mb-0">Years of</p>
                      <h6 className="text-uppercase mb-0">Experience</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                    <h1 className="flex-shrink-0 display-5 text-primary mb-0 counter" data-target="100">50</h1>
                    <div className="ps-4">
                      <p className="mb-0">Popular</p>
                      <h6 className="text-uppercase mb-0">Master Chefs</h6>
                    </div>
                  </div>
                </div>
              </div>
              <Link className="btn btn-primary py-3 px-5 mt-2" to="/about">Read More</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Preview Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center fadeInUp">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
            <h1 className="mb-5">Most Popular Items</h1>
          </div>
          
          <div className="row g-4">
            {/* Breakfast Items */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-1.jpg" 
                  alt="Burrito"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Burrito</span>
                    <span className="text-primary">₹100</span>
                  </h5>
                  <small className="fst-italic">A hearty and satisfying breakfast wrapped in a warm flour tortilla. Packed with classic morning favorites, it's a perfect on-the-go meal.</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-2.jpg" 
                  alt="Bread Pakora"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Bread Pakora</span>
                    <span className="text-primary">₹120</span>
                  </h5>
                  <small className="fst-italic">An Indian fried snack featuring spiced gram flour-coated bread slices. This popular street food is a delightful savory treat.</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-3.jpg" 
                  alt="Sandwich"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Sandwich</span>
                    <span className="text-primary">₹100</span>
                  </h5>
                  <small className="fst-italic">A versatile breakfast classic, featuring various morning ingredients layered between slices of bread. Perfect for a quick and customizable meal.</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-4.jpg" 
                  alt="French Toast"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>French Toast</span>
                    <span className="text-primary">₹150</span>
                  </h5>
                  <small className="fst-italic">Sliced bread soaked in a rich egg and milk batter, then pan-fried to golden perfection. Enjoy this sweet and comforting dish with your favorite toppings.</small>
                </div>
              </div>
            </div>
            
            {/* Lunch Items */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-9.jpg" 
                  alt="Rajma"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Rajma</span>
                    <span className="text-primary">₹100</span>
                  </h5>
                  <small className="fst-italic">A hearty and flavorful North Indian curry made with red kidney beans. Enjoy this comforting and protein-rich dish, perfect with rice or bread.</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-10.jpg" 
                  alt="Soup"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Soup</span>
                    <span className="text-primary">₹120</span>
                  </h5>
                  <small className="fst-italic">Warm your soul with our comforting soup. Crafted with fresh ingredients, it's the perfect start to any meal or a light, satisfying option on its own</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-11.jpg" 
                  alt="Wrap"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Wrap</span>
                    <span className="text-primary">₹150</span>
                  </h5>
                  <small className="fst-italic">A delightful and convenient meal, featuring your choice of savory fillings tightly wrapped in a soft tortilla. Customize it to your taste for a fresh and satisfying bite.</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="d-flex align-items-center menu-item">
                <img 
                  className="flex-shrink-0 img-fluid rounded" 
                  src="/img/menu-12.jpg" 
                  alt="Avocado"
                  style={{ width: '80px' }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>Avocado</span>
                    <span className="text-primary">₹250</span>
                  </h5>
                  <small className="fst-italic">Enjoy the creamy, rich goodness of fresh avocado. A versatile and healthy addition, perfect as a side or integrated into your favorite dishes</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link to="/menu" className="btn btn-primary py-3 px-5">
              View Full Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Reservation Section */}
      <div className="container-xxl py-5 px-0 fadeInUp">
        <div className="row g-0">
          <div className="col-md-6">
            <div className="video h-100">
              <img 
                className="img-fluid h-100" 
                src="/img/video.jpg" 
                alt="Restaurant Interior" 
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-md-6 bg-dark d-flex align-items-center">
            <div className="p-5">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">Reservation</h5>
              <h1 className="text-white mb-4">Book A Table Online</h1>
              <p className="text-white mb-4">
                Reserve your table now and enjoy an unforgettable dining experience with us. 
                Our team is ready to serve you the best.
              </p>
              <Link to="/booking" className="btn btn-primary py-3 px-5">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;