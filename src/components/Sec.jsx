import React from 'react'
import './Sec.css'

const Sec = () => {
  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/images/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-overlay"></div>

      <div className="hero-content text-center">
        <h1 className="display-4 fw-bold mb-3">
          Buy & Sell Smarter
        </h1>
        <p className="lead fw-bold">
          Discover the best products at unbeatable prices.
        </p>
        <a href="#products" className="btn btn-primary btn-lg mt-3">
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default Sec;