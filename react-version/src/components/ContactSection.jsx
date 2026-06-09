import { useState } from 'react';
import { useContactSettings } from '../hooks/useContactSettings';

export default function ContactSection() {
  const contact = useContactSettings();
  const [formData, setFormData] = useState({
    name: '',
    contactnumber: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error on change
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name || /<\/?[a-z][\s\S]*>/i.test(formData.name)) {
      newErrors.name = 'Invalid name!';
      isValid = false;
    }

    // Contact number validation
    if (!formData.contactnumber || formData.contactnumber.length !== 10 || /<\/?[a-z][\s\S]*>/i.test(formData.contactnumber)) {
      newErrors.contactnumber = 'Invalid contact number!';
      isValid = false;
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(formData.email)) {
      newErrors.email = 'Invalid email!';
      isValid = false;
    }

    // Subject validation
    if (formData.subject && /<\/?[a-z][\s\S]*>/i.test(formData.subject)) {
      newErrors.subject = 'Invalid subject!';
      isValid = false;
    }

    // Message validation
    if (!formData.message || /<\/?[a-z][\s\S]*>/i.test(formData.message)) {
      newErrors.message = 'Invalid message!';
      isValid = false;
    } else if (formData.message.length > 250) {
      newErrors.message = 'Message exceeds limit of 250 characters!';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      let enquiryStr = formData.subject
        ? `I want to enquire about your availability and the ${formData.subject}.`
        : `I want to enquire about your availability and the specific details of your services.`;

      let contactStr = formData.email
        ? `You can contact me on my email address ${formData.email} or contact number ${formData.contactnumber}.`
        : `You can contact me on my contact number ${formData.contactnumber}.`;

      const whatsAppMessage = `Hello,\r\nMy name is ${formData.name}. ${enquiryStr}\r\n${formData.message}.\r\n${contactStr}`;
      const encoded = encodeURI(whatsAppMessage);
      const waNumber = (contact.whatsapp_number || contact.phone_number || '').replace(/\D/g, '');
      window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
    }
  };

  return (
    <section className="contact-us">
      <div className="form-container">
        <div className="contact-header">
          <h1>Contact Us: Let&apos;s Create Magic Together</h1>
        </div>
        <div className="form-data-container">
          <div className="form-fields">
            <div>
              <div className="form">
                <form id="myForm" onSubmit={handleSubmit}>
                  <div className="contact-description-1">
                    <p>Ready to capture your moments with Anil Chauhan Photography?</p>
                  </div>

                  <div className="input-line-column">
                    <div className="input-container">
                      <input id="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} />
                      {errors.name && <p className="error-input-text">{errors.name}</p>}
                    </div>
                  </div>

                  <div className="input-line-column">
                    <div className="input-container">
                      <input id="contactnumber" type="number" placeholder="Contact Number" value={formData.contactnumber} onChange={handleChange} />
                      {errors.contactnumber && <p className="error-input-text">{errors.contactnumber}</p>}
                    </div>
                  </div>

                  <div className="input-line-column">
                    <div className="input-container">
                      <input id="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                      {errors.email && <p className="error-input-text">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="input-line-column">
                    <div className="input-container">
                      <input id="subject" type="text" placeholder="Subject" value={formData.subject} onChange={handleChange} />
                      {errors.subject && <p className="error-input-text">{errors.subject}</p>}
                    </div>
                    <div className="input-container">
                      <textarea
                        id="message"
                        className="textarea"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                      {errors.message && <p className="error-input-text">{errors.message}</p>}
                    </div>
                  </div>

                  <button type="submit" id="submit" className="hover">
                    Send via Whatsapp
                    <img src="/images/whatsapp-svgrepo-com.svg" alt="WhatsApp" />
                  </button>

                  <div className="contact-description-2">
                    <div className="contact-details">
                      {contact.address && (
                        <div>
                          <p className="details-heading">Address</p>
                          <p>{contact.address}</p>
                        </div>
                      )}
                      {contact.email && (
                        <div>
                          <p className="details-heading">Email</p>
                          <a href={`mailto:${contact.email}`}><p>{contact.email}</p></a>
                        </div>
                      )}
                      {contact.phone_number && (
                        <div>
                          <p className="details-heading">Contact Number</p>
                          <a href={`tel:${contact.phone_number}`}><p>{contact.phone_number}</p></a>
                        </div>
                      )}
                      {contact.business_hours && (
                        <div>
                          <p className="details-heading">Business Hours</p>
                          <p>{contact.business_hours}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="google-map-container">
            <iframe
              id="googleMap"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.274397131074!2d72.78022829999999!3d21.1414756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4cd07dbe5f%3A0xe9401c67d7c39ce4!2sAnil%20Chauhan%20Photography%20-%20Best%20wedding%20Photographer%20in%20Surat!5e0!3m2!1sen!2sin!4v1724004045589!5m2!1sen!2sin"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
