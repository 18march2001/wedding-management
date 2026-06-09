import { useState, useEffect } from 'react';
import { fetchTestimonials } from '../services/api';

const FALLBACK_TESTIMONIALS = [
  { id: 1, name: 'Priya & Rahul Sharma', description: 'Choosing Anil Chauhan Photography was the best decision we made for our wedding. Every photo was a masterpiece, capturing our emotions and the spirit of our day perfectly.', image: '/images/testimonials/testimonial_wedding.webp' },
  { id: 2, name: 'Neha & Arjun Mehta', description: 'Our pre-wedding shoot was magical. The team made us feel so comfortable, and the results were beyond our expectations. The photos perfectly reflect our love story.', image: '/images/testimonials/testimonial_prewedding.webp' },
  { id: 3, name: 'Aditi & Kunal Patel', description: "We couldn't be happier with the baby photos. Anil Chauhan Photography captured our little one's personality perfectly. These are memories we'll treasure forever.", image: '/images/testimonials/testimonial_baby.webp' },
  { id: 4, name: 'Simran & Rohan Verma', description: 'The maternity shoot was an incredible experience. The team made me feel so comfortable, and the photos turned out beautifully.', image: '/images/testimonials/testimonial_maternity.webp' },
];

const IMAGES = [
  '/images/testimonials/testimonial_wedding.webp',
  '/images/testimonials/testimonial_prewedding.webp',
  '/images/testimonials/testimonial_baby.webp',
  '/images/testimonials/testimonial_maternity.webp',
];

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials()
      .then((data) => {
        if (!data?.length) { setTestimonials(FALLBACK_TESTIMONIALS); return; }
        // Assign cycling local images since API has no image field
        const enriched = data.map((t, i) => ({ ...t, image: IMAGES[i % IMAGES.length] }));
        setTestimonials(enriched);
      })
      .catch(() => setTestimonials(FALLBACK_TESTIMONIALS))
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}
