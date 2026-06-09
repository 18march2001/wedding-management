import { useState, useEffect } from 'react';
import { fetchWebsiteSettings } from '../services/api';

export function useWebsiteSettings() {
  const [heroSliderImages, setHeroSliderImages] = useState([]);
  const [websiteContent, setWebsiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWebsiteSettings()
      .then((data) => {
        setHeroSliderImages(data?.hero_slider_images ?? []);
        setWebsiteContent(data?.website_content ?? null);
      })
      .catch((err) => {
        console.error('useWebsiteSettings:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { heroSliderImages, websiteContent, loading, error };
}
