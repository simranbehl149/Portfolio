import React, { useState, useEffect } from 'react';
import { ensureArray } from '../utils/helpers';

const ImageCarousel = ({ images, title, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const imageArray = ensureArray(images);

  if (imageArray.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <i className="ph ph-code" style={{ fontSize: '4rem', color: 'var(--green)', opacity: 0.3 }}></i>
          </div>
        </div>
      </div>
    );
  }

  if (imageArray.length === 1) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide">
          <img src={imageArray[0]} alt={title || 'Project'} />
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!autoPlay || imageArray.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => prev === imageArray.length - 1 ? 0 : prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [imageArray.length, autoPlay, interval]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    goToSlide(currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div 
          className="carousel-slides"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {imageArray.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image} alt={`${title || 'Project'} - ${index + 1}`} />
              <div className="carousel-counter">
                {index + 1} / {imageArray.length}
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          <i className="ph ph-caret-left"></i>
        </button>
        <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          <i className="ph ph-caret-right"></i>
        </button>
        <div className="carousel-dots">
          {imageArray.map((_, index) => (
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