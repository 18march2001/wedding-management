import { useState, useEffect } from 'react';
import { fetchWebsiteSettings } from '../services/api';

export function useWebsiteSettings() {
  const [heroSliderImages, setHeroSliderImages] = useState([]);
  const [websiteContent, setWebsiteContent] = useState(null);
  const [leftSideImage, setLeftSideImage] = useState(null);
  const [rightSideImage, setRightSideImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWebsiteSettings()
      .then((data) => {
        setHeroSliderImages(data?.hero_slider_images ?? []);
        setWebsiteContent(data?.website_content ?? null);
        setLeftSideImage(data?.left_side_image ?? null);
        setRightSideImage(data?.right_side_image ?? null);
      })
      .catch((err) => {
        console.error('useWebsiteSettings:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { heroSliderImages, websiteContent, leftSideImage, rightSideImage, loading, error };
}
