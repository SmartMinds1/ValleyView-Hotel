import React, { useState } from 'react';
import '../styles/Gallery.css';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import luxurySuite from '../assets/luxury-suite.jpg';
import diningArea from '../assets/dining-area.jpg';
import poolArea from '../assets/pool-area.jpg';
import spaWellness from '../assets/spa-wellness.jpg';
import eventSpace from '../assets/event-space.jpg';
import lobby from '../assets/lobby.jpg';
import cityView from '../assets/city-view.jpg';
import deluxeRoom from '../assets/deluxe-room.jpg';
import executiveSuite from '../assets/executive-suite.jpg';
import restaurantBar from '../assets/restaurant-bar.jpg';
import fitnessCenter from '../assets/fitness-center.jpg';
import weddingVenue from '../assets/wedding-venue.jpg';
import businessCenter from '../assets/business-center.jpg';
import terrace from '../assets/terrace.jpg';
import spaTreatment from '../assets/spa-treatment.jpg';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: luxurySuite,
      category: 'rooms',
      title: 'Luxury Suite',
      description: 'Elegant accommodations with stunning city views'
    },
    {
      id: 2,
      src: diningArea,
      category: 'dining',
      title: 'Fine Dining Restaurant',
      description: 'Exquisite culinary experiences in elegant surroundings'
    },
    {
      id: 3,
      src: poolArea,
      category: 'amenities',
      title: 'Infinity Pool',
      description: 'Relaxing oasis with panoramic views'
    },
    {
      id: 4,
      src: spaWellness,
      category: 'spa',
      title: 'Spa & Wellness Center',
      description: 'Ultimate relaxation and rejuvenation'
    },
    {
      id: 5,
      src: eventSpace,
      category: 'events',
      title: 'Grand Ballroom',
      description: 'Perfect venue for special occasions'
    },
    {
      id: 6,
      src: lobby,
      category: 'lobby',
      title: 'Grand Lobby',
      description: 'Sophisticated entrance with modern design'
    },
    {
      id: 7,
      src: cityView,
      category: 'views',
      title: 'City Skyline',
      description: 'Breathtaking panoramic city scenes'
    },
    {
      id: 8,
      src: deluxeRoom,
      category: 'rooms',
      title: 'Deluxe Room',
      description: 'Comfort and style in every detail'
    },
    {
      id: 9,
      src: executiveSuite,
      category: 'rooms',
      title: 'Executive Suite',
      description: 'Spacious living with premium amenities'
    },
    {
      id: 10,
      src: restaurantBar,
      category: 'dining',
      title: 'Lounge Bar',
      description: 'Perfect spot for evening cocktails'
    },
    {
      id: 11,
      src: fitnessCenter,
      category: 'amenities',
      title: 'Fitness Center',
      description: 'State-of-the-art gym equipment'
    },
    {
      id: 12,
      src: weddingVenue,
      category: 'events',
      title: 'Wedding Venue',
      description: 'Dream setting for your special day'
    },
    {
      id: 13,
      src: businessCenter,
      category: 'business',
      title: 'Business Center',
      description: 'Professional workspace for corporate needs'
    },
    {
      id: 14,
      src: terrace,
      category: 'views',
      title: 'Rooftop Terrace',
      description: 'Stunning outdoor relaxation area'
    },
    {
      id: 15,
      src: spaTreatment,
      category: 'spa',
      title: 'Spa Treatment Room',
      description: 'Professional wellness services'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'rooms', name: 'Rooms & Suites' },
    { id: 'dining', name: 'Dining' },
    { id: 'spa', name: 'Spa & Wellness' },
    { id: 'amenities', name: 'Amenities' },
    { id: 'events', name: 'Events' },
    { id: 'views', name: 'Views' },
    { id: 'business', name: 'Business' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="gallery-page">
      {/* Header Section */}
      <div className="gallery-hero">
        <div className="gallery-hero-content">
          <h1 className="gallery-title">Our Gallery</h1>
          <p className="gallery-subtitle">
            Discover the beauty and elegance of Valley View Hotel through our curated collection of images
          </p>
          <div className="gallery-stats">
            <div className="stat">
              <span className="stat-number">{galleryImages.length}+</span>
              <span className="stat-label">Beautiful Photos</span>
            </div>
            <div className="stat">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
        <div className="hero-background"></div>
      </div>

      {/* Category Filters */}
      <div className="gallery-filters">
        <div className="filters-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-container">
        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id}
              className={`gallery-item ${getItemSize(index)}`}
              onClick={() => openLightbox(image)}
            >
              <div className="gallery-image-wrapper">
                <div 
                  className="gallery-image"
                  style={{ 
                    backgroundImage: `url(${image.src})` // REMOVED GRADIENT
                  }}
                ></div>
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3 className="image-title">{image.title}</h3>
                    <p className="image-description">{image.description}</p>
                    <div className="view-button">View</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="gallery-cta">
        <div className="cta-content">
          <h2>Ready to Experience It Yourself?</h2>
          <p >Book your stay and create unforgettable memories at Valley View Hotel</p>
          <Link to="/reservations" className='btnView'>
          Book Your Stay Now
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              &times;
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={() => navigateImage('prev')}>
              ‹
            </button>
            <button className="lightbox-nav lightbox-next" onClick={() => navigateImage('next')}>
              ›
            </button>
            
            <div className="lightbox-image-container">
              <div 
                className="lightbox-image"
                style={{ 
                  backgroundImage: `url(${selectedImage.src})` // REMOVED GRADIENT
                }}
              ></div>
            </div>
            
            <div className="lightbox-info">
              <h3 className="lightbox-title">{selectedImage.title}</h3>
              <p className="lightbox-description">{selectedImage.description}</p>
              <div className="lightbox-meta">
                <span className="image-category">{categories.find(cat => cat.id === selectedImage.category)?.name}</span>
                <span className="image-number">
                  {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} of {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to create masonry layout with different sizes
const getItemSize = (index) => {
  const sizes = ['small', 'medium', 'large'];
  return sizes[index % sizes.length];
};

export default Gallery;