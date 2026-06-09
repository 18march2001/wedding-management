import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const fallbackImages = [
  '/images/temp2/header-1.webp',
  '/images/temp2/header-2.webp',
  '/images/temp2/header-3.webp',
  '/images/temp2/header-4.webp',
  '/images/temp2/header-5.webp',
];

function HeroSkeleton() {
  return (
    <div className="landing-page one">
      <div className="hero-skeleton" />
    </div>
  );
}

export default function HeroCarousel({ images = [], loading = false }) {
  if (loading) return <HeroSkeleton />;

  const slides = images.length
    ? images.map((img) => ({ key: img.id, src: img.url, alt: `Hero slide ${img.id}` }))
    : fallbackImages.map((src, i) => ({ key: i, src, alt: `Wedding photography header ${i + 1}` }));

  return (
    <div className="landing-page one">
      <div className="slider">
        <div className="container-fluid" style={{ position: 'fixed', width: '100%' }}>
          <div className="row" style={{ margin: 0 }}>
            <div style={{ padding: 0, width: '100%' }}>
              <Swiper
                modules={[Autoplay, Pagination]}
                className="parallax-slider"
                speed={1500}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                loop={true}
                centeredSlides={true}
                allowTouchMove={true}
                pagination={{ el: '#cover-swiper-pagination', clickable: true }}
              >
                {slides.map(({ key, src, alt }, index) => (
                  <SwiperSlide key={key}>
                    <div className="img-container">
                      <img src={src} alt={alt} loading={index === 0 ? 'eager' : 'lazy'} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-pagination-container">
                <div id="cover-swiper-pagination" className="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
