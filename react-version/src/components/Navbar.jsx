import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [burgerChecked, setBurgerChecked] = useState(false);
  const navRef = useRef(null);
  const prevScrollPos = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (navRef.current) {
        if (prevScrollPos.current > currentScrollPos) {
          navRef.current.style.top = '0';
        } else {
          navRef.current.style.top = '-80px';
        }
      }
      prevScrollPos.current = currentScrollPos;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (selector, fromBurger) => {
    if (fromBurger) {
      setBurgerChecked(false);
    }
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="navigation fade-down" ref={navRef}>
      <div className="logo home-link">
        <a href="/">
          <img src="/images/acp-logo.svg" className="logo-image" alt="Anil Chauhan Photography" />
        </a>
      </div>

      <div className="navigation-links">
        <ul>
          <li className="links" onClick={() => scrollToSection('.categories', false)}>Gallery</li>
          <li className="links" onClick={() => scrollToSection('.testimonial-container', false)}>Testimonial</li>
          <li className="links" onClick={() => scrollToSection('.about-us', false)}>About</li>
          <li className="links" onClick={() => scrollToSection('div.contact-header', false)}>Contact</li>
        </ul>
      </div>

      {/* Burger menu for mobile */}
      <div className="navigation-burger-container">
        <div className="call-us">
          <img className="footer-social-icon" src="/images/call-svgrepo-com.svg" alt="Call" />
          <ul><li><a href="tel:+91 9099825258">Call Us</a></li></ul>
        </div>
        <input
          id="burger"
          className="burger-menu-icon"
          type="checkbox"
          checked={burgerChecked}
          onChange={(e) => setBurgerChecked(e.target.checked)}
        />
        <label htmlFor="burger">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <nav>
          <ul>
            <li onClick={() => scrollToSection('.categories', true)}>Gallery</li>
            <li onClick={() => scrollToSection('.testimonial-container', true)}>Testimonial</li>
            <li onClick={() => scrollToSection('.about-us', true)}>About</li>
            <li onClick={() => scrollToSection('.contact-us', true)}>Contact</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
