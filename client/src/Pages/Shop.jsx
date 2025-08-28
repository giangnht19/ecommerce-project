import React, { useRef } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import './Shop.css';

const Shop = () => {
  const sectionRef = useRef(null);

  const scrollToSection = (section) => {
    if (section && section.current) {
      section.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="shop-container">
      <Hero scrollToSection={() => scrollToSection(sectionRef)} sectionRef={sectionRef} />
      <Popular />
      <Offers scrollToSection={() => scrollToSection(sectionRef)} sectionRef={sectionRef} />
      <div ref={sectionRef} className="main-content">
        <NewCollections />
        <NewsLetter />
      </div>
    </div>
  );
};

export default Shop;
