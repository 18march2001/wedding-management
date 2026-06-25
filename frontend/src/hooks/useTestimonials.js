import { useState, useEffect } from 'react';
import { fetchTestimonials } from '../services/api';

const FALLBACK_TESTIMONIALS = [
  { id: 1, name: 'Priya & Rahul Sharma', description: 'Choosing HareKrishna Photography was the best decision we made for our wedding. Every photo was a masterpiece, capturing our emotions and the spirit of our day perfectly.', photo_url: '/images/testimonials/testimonial_wedding.webp' },
  { id: 2, name: 'Neha & Arjun Mehta', description: 'Our pre-wedding shoot was magical. The team made us feel so comfortable, and the results were beyond our expectations. The photos perfectly reflect our love story.', photo_url: '/images/testimonials/testimonial_prewedding.webp' },
  { id: 3, name: 'Aditi & Kunal Patel', description: "We couldn't be happier with the baby photos. HareKrishna Photography captured our little one's personality perfectly. These are memories we'll treasure forever.", photo_url: '/images/testimonials/testimonial_baby.webp' },
  { id: 4, name: 'Simran & Rohan Verma', description: 'The maternity shoot was an incredible experience. The team made me feel so comfortable, and the photos turned out beautifully.', photo_url: '/images/testimonials/testimonial_maternity.webp' },
];

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials()
      .then((data) => {
        setTestimonials(data?.length ? data : FALLBACK_TESTIMONIALS);
      })
      .catch(() => setTestimonials(FALLBACK_TESTIMONIALS))
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}
