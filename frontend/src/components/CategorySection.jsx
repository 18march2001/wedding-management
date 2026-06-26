import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGalleryCategories } from '../hooks/useGalleryCategories';

gsap.registerPlugin(ScrollTrigger);

function CategorySkeleton() {
  return (
    <div id="categories" className="categories">
      {[...Array(4)].map((_, i) => (
        <section key={i} className="category">
          <div className="category-skeleton" />
        </section>
      ))}
    </div>
  );
}

export default function CategorySection() {
  const { categories, loading } = useGalleryCategories();
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (loading || categories.length === 0) return;

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((panel) => {
        if (!panel) return;

        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false,
        });

        const image = panel.querySelector('.overlay-img');
        if (image) {
          gsap.timeline({
            scrollTrigger: { trigger: panel, start: 'top top', scrub: true },
          }).from(image, 0.5, { scale: 1.3, ease: 'power2.out' });
        }
      });
    });

    return () => ctx.revert();
  }, [loading, categories.length]);

  if (loading) return <CategorySkeleton />;

  return (
    <div id="categories" className="categories">
      {categories.map((cat, index) => (
        <section
          key={cat.id}
          className="category"
          ref={(el) => (sectionRefs.current[index] = el)}
        >
          <div className="category-image-container">
            <Link to={`/gallery/${cat.slug}`} className="category-label-container">
              <div className="category-label">
                <h1>{cat.name}</h1>
                {cat.description && <h5>{cat.description}</h5>}
              </div>
              <img
                className="arrow-icon"
                src="/images/temp2/right-arrow-svgrepo-com.png"
                alt=""
              />
            </Link>
            {cat.image_url ? (
              <img
                className="overlay-img"
                src={cat.image_url}
                alt={cat.name}
                loading="lazy"
              />
            ) : (
              <div className="overlay-img category-no-image" />
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
