import { useContactSettings } from '../hooks/useContactSettings';

export default function Footer() {
  const contact = useContactSettings();

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-section-1 col-center">
        <img
          src="/images/acp-logo.svg"
          className="logo-image white"
          style={{ height: '60px' }}
          alt="HareKrishna Photography"
        />
        <div className="social">
          <a href="https://www.instagram.com/anil_chauhan_photography/" target="_blank" rel="noopener noreferrer" className="link">
            <img className="footer-social-icon" src="/images/instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.youtube.com/@anilchauhanphotography" target="_blank" rel="noopener noreferrer" className="link">
            <img className="footer-social-icon" src="/images/youtube-icon-svgrepo-com.svg" alt="YouTube" />
          </a>
        </div>
        <p style={{ color: '#818181', fontSize: 'smaller', marginTop: '10px' }}>
          2024 © All Rights Reserved
        </p>
      </div>
      <div className="footer-section-2">
        <div className="col-center">
          <ul>
            <li className="footer-links-header"><h4>Links</h4></li>
            <li className="footer-links" onClick={() => scrollToSection('.categories')}>Gallery</li>
            <li className="footer-links" onClick={() => scrollToSection('.testimonial-container')}>Testimonials</li>
            <li className="footer-links" onClick={() => scrollToSection('.about-us')}>About Us</li>
            <li className="footer-links" onClick={() => scrollToSection('.contact-us')}>Contact Us</li>
          </ul>
        </div>
        <div className="col-center">
          <ul>
            <li className="footer-links-header"><h4>Contact Info</h4></li>
            <li className="contact-group" style={{ marginBottom: '10px' }}>
              <img className="footer-social-icon" src="/images/call-svgrepo-com.svg" alt="Phone" />
              <a href={`tel:${contact.phone_number}`}>{contact.phone_number}</a>
            </li>
            <li className="contact-group">
              <img className="footer-social-icon" src="/images/email-8-svgrepo-com.svg" alt="Email" />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
