import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGalleryPage } from '../hooks/useGalleryPage';

gsap.registerPlugin(ScrollTrigger);

export default function GalleryPage() {
  const { category: slug } = useParams();
  const { category, images, loading, error } = useGalleryPage(slug);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const galleryRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('reloadAnimationRequired', 'false');
  }, []);

  // GSAP clip-path reveal on scroll for each image
  useEffect(() => {
    if (images.length === 0) return;

    const timer = setTimeout(() => {
      const masks = document.querySelectorAll('.mask');
      const observer = new IntersectionObserver(
        (entries, self) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const container = entry.target;
            const img = container.querySelector('.gallery-image');
            const tl = gsap.timeline({ ease: 'power3.out' });

            tl.set(container, { visibility: 'visible' });
            tl.fromTo(
              container,
              { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)', webkitClipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
              { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', webkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }
            );
            tl.from(img, 4, { scale: 1.4, ease: 'power3.out', delay: -1 });
            self.unobserve(entry.target);
          });
        },
        { threshold: 0.1 }
      );

      masks.forEach((mask) => observer.observe(mask));
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [images]);

  return (
    <div className="all">
      <div className="home">

        {/* Navigation */}
        <div className="navigation fade-down">
          <div className="logo home-link">
            <Link to="/">
              <img className="back-icon" src="/images/temp2/arrow-left-svgrepo-com.png" alt="Back" />
              Back
            </Link>
          </div>
        </div>

        {/* Hero — category image as background */}
        <div className="gallery-fixed-container">
          <div className="gallery-description-container">
            <div className="gallery-content">
              {category && (
                <>
                  <h1>{category.name}</h1>
                  {category.description && <p>{category.description}</p>}
                </>
              )}
            </div>
            {category?.video_url ? (
              <video
                src={category.video_url}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : category?.image_url ? (
              <img src={category.image_url} alt={category?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#111' }} />
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-container-fluid">

          {loading && (
            <p style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Loading gallery...</p>
          )}

          {error && !loading && (
            <p style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
              {error === 'Category not found' ? 'Category not found.' : 'Failed to load images.'}
            </p>
          )}

          {!loading && !error && images.length === 0 && (
            <p style={{ textAlign: 'center', padding: '50px', color: '#888' }}>No images found for this category.</p>
          )}

          <article className="gallery zoom-gallery" ref={galleryRef}>
            {images.map((img, index) => (
              <a
                key={img.id}
                className="image-popup-no-margins"
                href="#"
                onClick={(e) => { e.preventDefault(); setLightboxIndex(index); }}
              >
                <div className="mask">
                  <figure className="gallery-image">
                    <img src={img.thumb_url} alt={img.galleryTitle} loading="lazy" />
                  </figure>
                </div>
              </a>
            ))}
          </article>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(-1)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(-1)}>&times;</button>
          <button
            className="lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p > 0 ? p - 1 : images.length - 1)); }}
          >&#8249;</button>
          <img
            src={images[lightboxIndex]?.url}
            alt={images[lightboxIndex]?.galleryTitle}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p < images.length - 1 ? p + 1 : 0)); }}
          >&#8250;</button>
        </div>
      )}
    </div>
  );
}
