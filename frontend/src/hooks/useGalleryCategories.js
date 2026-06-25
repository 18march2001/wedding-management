import { useState, useEffect } from 'react';
import { fetchGalleryCategories } from '../services/api';

const FALLBACK_CATEGORIES = [
  { id: 'f1', name: 'Wedding Photography', description: 'Your Love Story, Perfectly Told', slug: 'wedding', image_url: '/images/categories/images/wedding.webp' },
  { id: 'f2', name: 'Pre-Wedding Photography', description: 'The Journey Begins', slug: 'pre_wedding', image_url: '/images/categories/images/pre-wedding.webp' },
  { id: 'f3', name: 'Maternity & Baby Shoots', description: 'Cherishing Every Milestone', slug: 'maternity_and_baby_shoots', image_url: '/images/categories/images/baby_category.webp' },
  { id: 'f4', name: 'Product Photography', description: 'Elevate Your Brand', slug: 'product', image_url: '/images/categories/images/Product.webp' },
  { id: 'f5', name: 'Modeling', description: 'Showcase Your Best Self', slug: 'modeling', image_url: '/images/categories/images/Model.webp' },
  { id: 'f6', name: 'Interior', description: 'Showcase Your Best Self', slug: 'interior', image_url: '/images/categories/images/Interior.webp' },
];

export function useGalleryCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGalleryCategories()
      .then((cats) => {
        setCategories(cats?.length ? cats : FALLBACK_CATEGORIES);
      })
      .catch((err) => {
        console.error('useGalleryCategories:', err);
        setError(err);
        setCategories(FALLBACK_CATEGORIES);
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
