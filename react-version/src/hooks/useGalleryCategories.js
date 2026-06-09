import { useState, useEffect } from 'react';
import { fetchGalleryCategories, fetchGalleries } from '../services/api';

const FALLBACK_CATEGORIES = [
  { id: 'f1', name: 'Wedding Photography', description: 'Your Love Story, Perfectly Told', slug: 'wedding', cover_image_url: '/images/categories/images/wedding.webp' },
  { id: 'f2', name: 'Pre-Wedding Photography', description: 'The Journey Begins', slug: 'pre_wedding', cover_image_url: '/images/categories/images/pre-wedding.webp' },
  { id: 'f3', name: 'Maternity & Baby Shoots', description: 'Cherishing Every Milestone', slug: 'maternity_and_baby_shoots', cover_image_url: '/images/categories/images/baby_category.webp' },
  { id: 'f4', name: 'Product Photography', description: 'Elevate Your Brand', slug: 'product', cover_image_url: '/images/categories/images/Product.webp' },
  { id: 'f5', name: 'Modeling', description: 'Showcase Your Best Self', slug: 'modeling', cover_image_url: '/images/categories/images/Model.webp' },
  { id: 'f6', name: 'Interior', description: 'Showcase Your Best Self', slug: 'interior', cover_image_url: '/images/categories/images/Interior.webp' },
];

export function useGalleryCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchGalleryCategories(), fetchGalleries()])
      .then(([cats, galleries]) => {
        if (!cats?.length) {
          setCategories(FALLBACK_CATEGORIES);
          return;
        }
        const enriched = cats.map((cat) => {
          const match = (galleries ?? []).find(
            (g) => g.gallery_category_id === cat.id && g.cover_image_url
          );
          return { ...cat, cover_image_url: match?.cover_image_url ?? null };
        });
        setCategories(enriched);
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
