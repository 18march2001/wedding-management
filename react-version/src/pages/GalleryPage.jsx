import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categoryMap = {
  wedding: {
    title: 'Wedding Photography',
    description:
      'Your wedding day is a tapestry of emotions, joy, and unforgettable moments. At Anil Chauhan Photography, we specialize in capturing these moments in their purest form.',
    apiName: 'wedding',
    video: '/images/categories/videos/wedding.mp4',
  },
  pre_wedding: {
    title: 'Pre-Wedding Photography',
    description:
      'Before the big day, let us capture the beautiful journey of your love story with stunning pre-wedding photography that reflects your unique bond.',
    apiName: 'pre_wedding',
    video: '/images/categories/videos/pre-wedding_video.mp4',
  },
  maternity_and_baby_shoots: {
    title: 'Maternity & Baby Shoots',
    description:
      'Celebrate the beautiful journey of parenthood with our maternity and baby photography sessions, capturing every precious milestone.',
    apiName: 'maternity_and_baby_shoots',
    video: '/images/categories/videos/baby.mp4',
  },
  product: {
    title: 'Product Photography',
    description:
      'Elevate your brand with professional product photography that highlights the unique features and quality of your products.',
    apiName: 'product',
    video: '/images/categories/videos/Product.mp4',
  },
  modeling: {
    title: 'Modeling',
    description:
      'Showcase your best self with professional modeling photography that captures your personality and style.',
    apiName: 'modeling',
    video: '/images/categories/videos/Model.mp4',
  },
  interior: {
    title: 'Interior',
    description:
      'Transform your interior spaces into visual stories with our expert architectural and interior photography.',
    apiName: 'interior',
    video: '/images/categories/videos/Interior.MP4',
  },
};

function modifyImageUrl(url) {
  const imageOptions = 'f_auto,q_auto,w_400';
  const urlParts = url.split('/');
  urlParts.splice(6, 0, imageOptions);
  return urlParts.join('/');
}

export default function GalleryPage() {
  const { category } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const galleryRef = useRef(null);
  const maskRefs = useRef([]);
  const catInfo = categoryMap[category] || categoryMap.wedding;

  useEffect(() => {
    sessionStorage.setItem('reloadAnimationRequired', 'false');
  }, []);

  useEffect(() => {
    setLoading(true);
    setImages([]);

    async function fetchImages() {
      try {
        const res = await fetch(
          `https://anilchauhanphotography-imageservice-lcyx.onrender.com/api/images/?folderName=${catInfo.apiName}`
        );
        const data = await res.json();
        setImages(data.data || []);
      } catch (err) {
        console.error('Failed to fetch images:', err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [catInfo.apiName]);

  useEffect(() => {
    if (images.length === 0) return;

    // GSAP clip-path reveal animation for each image
    const timer = setTimeout(() => {
      const masks = document.querySelectorAll('.mask');
      const observer = new IntersectionObserver(
        (entries, self) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const container = entry.target;
              const img = container.querySelector('.gallery-image');
              const easeInOut = 'power3.out';
              const tl = gsap.timeline({ ease: easeInOut });

              tl.set(container, { visibility: 'visible' });
              tl.fromTo(
                container,
                {
                  clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
                  webkitClipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
                },
                {
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  webkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  duration: 1,
                  ease: easeInOut,
                }
              );
              tl.from(img, 4, { scale: 1.4, ease: easeInOut, delay: -1 });
              self.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: '0px', threshold: 0.1 }
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
              <img
                className="back-icon"
                src="/images/temp2/arrow-left-svgrepo-com.png"
                alt="Back"
              />
              Back
            </Link>
          </div>
        </div>

        {/* Gallery Hero */}
        <div className="gallery-fixed-container">
          <div className="gallery-description-container">
            <div className="gallery-content">
              <h1>{catInfo.title}</h1>
              <p>{catInfo.description}</p>
            </div>
            <video
              className="gallery-video"
              preload="metadata"
              autoPlay
              playsInline
              muted
              loop
            >
              <source src={catInfo.video} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-container-fluid">
          {loading && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
              <p style={{ textAlign: 'center' }}>Loading gallery...</p>
            </div>
          )}
          <article className="gallery zoom-gallery" ref={galleryRef}>
            {images.map((src, index) => (
              <a
                key={index}
                className="image-popup-no-margins"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setLightboxIndex(index);
                }}
              >
                <div className="mask">
                  <figure className="gallery-image">
                    <img src={modifyImageUrl(src)} alt={`Gallery ${index + 1}`} loading="lazy" />
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
          <button className="lightbox-close" onClick={() => setLightboxIndex(-1)}>
            &times;
          </button>
          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            }}
          >
            &#8249;
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`Full size ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }}
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
