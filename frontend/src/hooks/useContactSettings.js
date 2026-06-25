import { useState, useEffect } from 'react';
import { fetchContactSettings } from '../services/api';

const FALLBACK = {
  phone_number: '+91 9099825258',
  whatsapp_number: '919099825258',
  email: 'harekrishnaphotography@gmail.com',
  address: 'G-6, Highfield Ascot, beside Black Bunny Club, opp. Palm Avenue, Vip Road, Vesu, Surat, Gujarat 395007',
  business_hours: null,
  instagram_url: null,
  facebook_url: null,
};

export function useContactSettings() {
  const [contact, setContact] = useState(FALLBACK);

  useEffect(() => {
    fetchContactSettings()
      .then((data) => setContact({ ...FALLBACK, ...data }))
      .catch(() => setContact(FALLBACK));
  }, []);

  return contact;
}
