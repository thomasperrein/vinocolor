import React from "react";
import img from "../assets/img/hero-img.jpg";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="hero-subtitle">The natural touch for aging excellence</p>
        <h1 className="hero-title">
          Vinocolor,
          <br />
          the art of colouring wine,
          <br />
          naturally
        </h1>
        <button className="hero-button">See our products</button>
      </div>
      <div className="hero-image">
        <img src={img} alt="Wine barrels being handled" />
      </div>
    </section>
  );
};

export default HeroSection;
