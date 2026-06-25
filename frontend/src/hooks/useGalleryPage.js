import { useState, useEffect } from 'react';
import { fetchGalleryCategories, fetchGalleriesByCategory, fetchGalleryImages } from '../services/api';

export function useGalleryPage(slug) {
  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setImages([]);
    setCategory(null);
    setError(null);

    fetchGalleryCategories()
      .then((cats) => {
        const cat = (cats ?? []).find((c) => c.slug === slug);
        if (!cat) throw new Error('Category not found');
        setCategory(cat);
        return fetchGalleriesByCategory(cat.id);
      })
      .then((galleries) => {
        // Fetch images for all galleries in parallel
        return Promise.all(
          (galleries ?? []).map((g) =>
            fetchGalleryImages(g.id).then((imgs) =>
              imgs.map((img) => ({ ...img, galleryTitle: g.title }))
            )
          )
        );
      })
      .then((nested) => setImages(nested.flat()))
      .catch((err) => {
        console.error('useGalleryPage:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { category, images, loading, error };
}
