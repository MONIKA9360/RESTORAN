import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    // Scroll-triggered counter animation
    const handleScroll = () => {
      const countersSection = document.querySelector('.counters-section');
      const counters = document.querySelectorAll('.counter');
      
      if (countersSection && counters.length > 0) {
        const sectionTop = countersSection.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Trigger animation when counters section comes into view
        if (scrollPosition > sectionTop + 100 && !countersSection.dataset.animated) {
          countersSection.dataset.animated = 'true';
          
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
      {/* Hero Header */}
      <div className="container-xxl py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">About Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">About</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* About Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-100 fadeInUp" src="/img/about-1.jpg" alt="About 1" />
                </div>
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-75 fadeInUp" src="/img/about-2.jpg" alt="About 2" style={{ marginTop: '25%' }} />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-75 fadeInUp" src="/img/about-3.jpg" alt="About 3" />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-100 fadeInUp" src="/img/about-4.jpg" alt="About 4" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
              <h1 className="mb-4">Welcome to <i className="fa fa-utensils text-primary me-2"></i>Restoran</h1>
              <p className="mb-4">
                Welcome to Restoran, where every detail is crafted for your enjoyment. We offer a dining 
                experience that is both sophisticated and inviting. From the moment you step through our doors, 
                you'll find an atmosphere of warmth and genuine hospitality.
              </p>
              <p className="mb-4">
                Our culinary team is dedicated to creating exquisite dishes that tantalize your taste buds 
                and leave you with unforgettable memories. Whether you're here for a special occasion or a 
                casual meal, we promise a delightful journey of flavors and comfort.
              </p>
              <div className="row g-4 mb-4 counters-section">
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
              <Link className="btn btn-primary py-3 px-5 mt-2" to="/contact">Read More</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container-xxl pt-5 pb-3">
        <div className="container">
          <div className="text-center fadeInUp mb-5">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Team Members</h5>
            <h1 className="mb-5">Our Master Chefs</h1>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-3 col-md-6 fadeInUp">
              <div className="team-item text-center rounded overflow-hidden h-100">
                <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px', margin: '20px auto' }}>
                  <img className="img-fluid w-100 h-100" src="/img/about-1.jpg" alt="Chef 1" style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Chef John</h5>
                  <small className="text-muted">Head Chef</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 fadeInUp">
              <div className="team-item text-center rounded overflow-hidden h-100">
                <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px', margin: '20px auto' }}>
                  <img className="img-fluid w-100 h-100" src="/img/about-2.jpg" alt="Chef 2" style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Chef Sarah</h5>
                  <small className="text-muted">Sous Chef</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 fadeInUp">
              <div className="team-item text-center rounded overflow-hidden h-100">
                <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px', margin: '20px auto' }}>
                  <img className="img-fluid w-100 h-100" src="/img/about-3.jpg" alt="Chef 3" style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Chef Mike</h5>
                  <small className="text-muted">Pastry Chef</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 fadeInUp">
              <div className="team-item text-center rounded overflow-hidden h-100">
                <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px', margin: '20px auto' }}>
                  <img className="img-fluid w-100 h-100" src="/img/about-4.jpg" alt="Chef 4" style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Chef Lisa</h5>
                  <small className="text-muted">Grill Master</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;