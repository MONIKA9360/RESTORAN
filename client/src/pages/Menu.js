import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuAPI } from '../services/api';

// Complete menu data matching original template exactly
const mockMenuData = [
  {
    id: 1,
    name: 'Breakfast',
    description: 'Popular breakfast items',
    items: [
      {
        id: 1,
        name: 'Burrito',
        description: 'A hearty and satisfying breakfast wrapped in a warm flour tortilla. Packed with classic morning favorites, it\'s a perfect on-the-go meal.',
        price: 100,
        image_url: 'img/menu-1.jpg'
      },
      {
        id: 2,
        name: 'Bread-pakora',
        description: 'An Indian fried snack featuring spiced gram flour-coated bread slices. This popular street food is a delightful savory treat.',
        price: 120,
        image_url: 'img/menu-2.jpg'
      },
      {
        id: 3,
        name: 'Sandwich',
        description: 'A versatile breakfast classic, featuring various morning ingredients layered between slices of bread. Perfect for a quick and customizable meal.',
        price: 100,
        image_url: 'img/menu-3.jpg'
      },
      {
        id: 4,
        name: 'French toast',
        description: 'Sliced bread soaked in a rich egg and milk batter, then pan-fried to golden perfection. Enjoy this sweet and comforting dish with your favorite toppings.',
        price: 150,
        image_url: 'img/menu-4.jpg'
      },
      {
        id: 5,
        name: 'Poha',
        description: 'A traditional South Asian dish made from flattened rice flakes. Light, fluffy, and often seasoned with spices and vegetables, it\'s a wholesome breakfast option.',
        price: 170,
        image_url: 'img/menu-5.jpg'
      },
      {
        id: 6,
        name: 'Aloo-paratha',
        description: 'A delicious North Indian flatbread stuffed with a flavorful mixture of spiced mashed potatoes. Traditionally enjoyed for breakfast with butter or ghee.',
        price: 100,
        image_url: 'img/menu-6.jpg'
      },
      {
        id: 7,
        name: 'Vada-pav',
        description: 'A beloved vegetarian fast food from Maharashtra, India. It consists of a deep-fried potato dumpling nestled within a soft bread bun.',
        price: 120,
        image_url: 'img/menu-7.jpg'
      },
      {
        id: 8,
        name: 'Waffles',
        description: 'Golden, crispy, and fluffy, these delicious grids are made from a simple batter. A versatile and delightful breakfast or brunch item',
        price: 150,
        image_url: 'img/menu-8.jpg'
      }
    ]
  },
  {
    id: 2,
    name: 'Lunch',
    description: 'Special lunch offerings',
    items: [
      {
        id: 9,
        name: 'Rajma',
        description: 'A hearty and flavorful North Indian curry made with red kidney beans. Enjoy this comforting and protein-rich dish, perfect with rice or bread.',
        price: 100,
        image_url: 'img/menu-9.jpg'
      },
      {
        id: 10,
        name: 'Soup',
        description: 'Warm your soul with our comforting soup. Crafted with fresh ingredients, it\'s the perfect start to any meal or a light, satisfying option on its own',
        price: 120,
        image_url: 'img/menu-10.jpg'
      },
      {
        id: 11,
        name: 'Wrap',
        description: 'A delightful and convenient meal, featuring your choice of savory fillings tightly wrapped in a soft tortilla. Customize it to your taste for a fresh and satisfying bite.',
        price: 150,
        image_url: 'img/menu-11.jpg'
      },
      {
        id: 12,
        name: 'Avocado',
        description: 'Enjoy the creamy, rich goodness of fresh avocado. A versatile and healthy addition, perfect as a side or integrated into your favorite dishes',
        price: 250,
        image_url: 'img/menu-12.jpg'
      },
      {
        id: 13,
        name: 'Tehri recipe',
        description: 'Experience the aromatic delight of Tehri, a flavorful rice dish cooked with vegetables and spices. A wholesome and satisfying meal, perfect for any time of day.',
        price: 180,
        image_url: 'img/menu-13.jpg'
      },
      {
        id: 14,
        name: 'Masala Bhindi',
        description: 'Delicious pan-fried okra (bhindi) tossed in a vibrant blend of aromatic Indian spices. A delightful and popular vegetarian side dish.',
        price: 150,
        image_url: 'img/menu-14.jpg'
      },
      {
        id: 15,
        name: 'Gujarati kadhi',
        description: 'Savor the unique flavors of Gujarati Kadhi, a sweet and tangy yogurt-based curry. Light, comforting, and a perfect accompaniment to rice.',
        price: 120,
        image_url: 'img/menu-15.jpg'
      },
      {
        id: 16,
        name: 'Salad',
        description: 'Fresh, crisp, and vibrant, our salads are crafted with the finest seasonal produce. A healthy and refreshing choice to complement your meal.',
        price: 120,
        image_url: 'img/menu-16.jpg'
      }
    ]
  },
  {
    id: 3,
    name: 'Dinner',
    description: 'Lovely dinner selections',
    items: [
      {
        id: 17,
        name: 'Palak paneer',
        description: 'A classic Indian delicacy featuring soft cubes of paneer (Indian cheese) simmered in a rich, creamy spinach gravy. A wholesome and flavorful vegetarian favorite.',
        price: 120,
        image_url: 'img/menu-17.jpg'
      },
      {
        id: 18,
        name: 'Dal fry',
        description: 'A comforting and popular lentil dish, our Dal Fry is made with tender cooked lentils tempered with aromatic spices, onions, and tomatoes. Perfect with rice or bread.',
        price: 150,
        image_url: 'img/menu-18.jpg'
      },
      {
        id: 19,
        name: 'Matar paneer',
        description: 'A delicious and widely loved North Indian curry combining tender green peas (matar) and soft paneer cubes in a rich, flavorful tomato-based gravy.',
        price: 120,
        image_url: 'img/menu-19.jpg'
      },
      {
        id: 20,
        name: 'Chana masala',
        description: 'A robust and tangy North Indian curry made with chickpeas (chana) cooked in a vibrant blend of spices, onions, and tomatoes. A hearty and satisfying vegetarian delight.',
        price: 150,
        image_url: 'img/menu-20.jpg'
      },
      {
        id: 21,
        name: 'Paneer curry',
        description: 'Experience our delightful Paneer Curry, featuring succulent cubes of Indian cheese simmered in a rich and aromatic gravy. A versatile and deeply satisfying vegetarian option.',
        price: 180,
        image_url: 'img/menu-21.jpg'
      },
      {
        id: 22,
        name: 'Veg pulao',
        description: 'A fragrant and flavorful rice dish cooked with mixed vegetables and aromatic spices. Our Veg Pulao is a light yet satisfying meal on its own or a great accompaniment.',
        price: 120,
        image_url: 'img/menu-22.jpg'
      },
      {
        id: 23,
        name: 'Sambar',
        description: 'A South Indian staple, our Sambar is a tangy and spicy lentil-based vegetable stew. Perfect with idli, dosa, or rice, offering a burst of authentic flavors.',
        price: 100,
        image_url: 'img/menu-23.jpg'
      },
      {
        id: 24,
        name: 'Rajma',
        description: 'A hearty and comforting North Indian curry made with red kidney beans, slow-cooked in a rich tomato-based gravy with aromatic spices. A wholesome and deeply satisfying dish.',
        price: 120,
        image_url: 'img/menu-24.jpg'
      }
    ]
  }
];

const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      // Temporarily force mock data to show all items
      console.log('Using mock data with all items');
      setMenuData(mockMenuData);
    } catch (error) {
      console.error('Error fetching menu:', error);
      console.log('Using mock data instead');
      // Use mock data when API is not available
      setMenuData(mockMenuData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="container-xxl py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Food Menu</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/">Pages</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Menu</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp mb-5">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
            <h1 className="mb-5">Most Popular Items</h1>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="tab-class text-center wow fadeInUp">
              {/* Category Tabs */}
              <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                <li className="nav-item">
                  <a
                    className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 ${
                      activeCategory === 0 ? 'active' : ''
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(0);
                    }}
                  >
                    <i className="fa fa-coffee fa-2x text-primary"></i>
                    <div className="ps-3">
                      <small className="text-body">Popular</small>
                      <h6 className="mt-n1 mb-0">Breakfast</h6>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`d-flex align-items-center text-start mx-3 pb-3 ${
                      activeCategory === 1 ? 'active' : ''
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(1);
                    }}
                  >
                    <i className="fa fa-hamburger fa-2x text-primary"></i>
                    <div className="ps-3">
                      <small className="text-body">Special</small>
                      <h6 className="mt-n1 mb-0">Lunch</h6>
                    </div>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`d-flex align-items-center text-start mx-3 me-0 pb-3 ${
                      activeCategory === 2 ? 'active' : ''
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(2);
                    }}
                  >
                    <i className="fa fa-utensils fa-2x text-primary"></i>
                    <div className="ps-3">
                      <small className="text-body">Lovely</small>
                      <h6 className="mt-n1 mb-0">Dinner</h6>
                    </div>
                  </a>
                </li>
              </ul>

              {/* Menu Items */}
              <div className="tab-content">
                {menuData.map((category, categoryIndex) => (
                  <div
                    key={category.id}
                    className={`tab-pane fade ${
                      activeCategory === categoryIndex ? 'show active' : ''
                    } p-0`}
                  >
                    <div className="row g-4">
                      {category.items.map((item) => (
                        <div key={item.id} className="col-lg-6">
                          <div className="d-flex align-items-center">
                            <img
                              className="flex-shrink-0 img-fluid rounded"
                              src={`/${item.image_url}`}
                              alt={item.name}
                              style={{ width: '80px' }}
                            />
                            <div className="w-100 d-flex flex-column text-start ps-4">
                              <h5 className="d-flex justify-content-between border-bottom pb-2">
                                <span>{item.name}</span>
                                <span className="text-primary">Rs.{item.price}</span>
                              </h5>
                              <small className="fst-italic">{item.description}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;