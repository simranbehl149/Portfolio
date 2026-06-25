import React, { useState, useEffect } from 'react';

const ImageCarousel = ({ images, title, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // If no images or only one image, show it without carousel
  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide">
          <div className="carousel-placeholder">
            <i className="ph ph-code"></i>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide">
          <img src={images[0]} alt={title} />
        </div>
      </div>
    );
  }

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, autoPlay, interval]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    goToSlide(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  return (
    <div className="carousel-container">
      <div 
        className="carousel-wrapper"
        onMouseEnter={() => {
          // Pause auto-play on hover if needed
        }}
        onMouseLeave={() => {
          // Resume auto-play if needed
        }}
      >
        <div 
          className="carousel-slides"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image} alt={`${title} - ${index + 1}`} />
              <div className="carousel-counter">
                {index + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          <i className="ph ph-caret-left"></i>
        </button>
        <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          <i className="ph ph-caret-right"></i>
        </button>

        {/* Dot Indicators */}
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;