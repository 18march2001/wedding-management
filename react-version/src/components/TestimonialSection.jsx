import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Controller } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';
import { useTestimonials } from '../hooks/useTestimonials';

export default function TestimonialSection() {
  const [imageSwiper, setImageSwiper] = useState(null);
  const [textSwiper, setTextSwiper] = useState(null);
  const { testimonials } = useTestimonials();

  useEffect(() => {
    if (imageSwiper && textSwiper) {
      imageSwiper.controller.control = textSwiper;
    }
  }, [imageSwiper, textSwiper]);

  return (
    <section className="three">
      <div className="testimonials-bg-rect-design">
        <div></div>
      </div>
      <div className="testimonial-container">
        <div className="title">
          <div className="left">
            <h1>What Our Clients Are Saying</h1>
          </div>
          <div className="right"></div>
        </div>

        <div className="testimonial-content-container">
          <div className="left">
            <Swiper
              modules={[Navigation, Pagination, Controller]}
              onSwiper={setImageSwiper}
              speed={1000}
              slidesPerView={1}
              centeredSlides={true}
              followFinger={false}
              grabCursor={true}
              pagination={{
                el: '#testimonial-swiper-pagination',
                clickable: false,
              }}
              navigation={{
                nextEl: '#testimonial-controls .next-ctrl',
                prevEl: '#testimonial-controls .prev-ctrl',
              }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={t.id ?? i}>
                  <img className="testimonial-image" src={t.image} alt={t.name} loading="lazy" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="right">
            <Swiper
              modules={[Controller]}
              onSwiper={setTextSwiper}
              direction="vertical"
              effect="slide"
              autoHeight={true}
              allowTouchMove={false}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={t.id ?? i}>
                  <div className="testimonial-text-wrapper">
                    <div className="quote-text">
                      <blockquote className="testimonial-content-p">
                        {t.description}
                      </blockquote>
                      {' '}- {t.name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="swiper-pagination-container">
          <div id="testimonial-swiper-pagination" className="swiper-pagination"></div>
        </div>

        <div id="testimonial-controls" className="slider-controls fade-up-two">
          <div className="control left">
            <div className="swiper-nav-ctrl prev-ctrl">
              <img src="/images/left-arrow-svgrepo-com.png" alt="prev" className="slider-control-image" />
            </div>
          </div>
          <div className="control right">
            <div className="swiper-nav-ctrl next-ctrl">
              <img src="/images/right-arrow-svgrepo-com.png" alt="next" className="slider-control-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
