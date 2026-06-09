import { useEffect, useRef, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Skip preloader if returning from a gallery page
    if (sessionStorage.getItem('reloadAnimationRequired') === 'false') {
      setVisible(false);
      sessionStorage.removeItem('reloadAnimationRequired');
      return;
    }

    const video = videoRef.current;
    if (video) {
      video.style.display = 'block';
      video.play().catch(() => {
        // Autoplay blocked, dismiss preloader after short delay
        setTimeout(() => dismissPreloader(), 1500);
      });

      video.onended = () => {
        dismissPreloader();
      };

      // Safety timeout in case video doesn't fire onended
      setTimeout(() => {
        dismissPreloader();
      }, 5000);
    }
  }, []);

  const dismissPreloader = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'top 1.8s cubic-bezier(0.19, 1, 0.22, 1)';
      containerRef.current.style.top = '-120%';
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  };

  if (!visible) return null;

  return (
    <div id="preloader" ref={containerRef}>
      <div className="p">
        <video
          ref={videoRef}
          className="logo-video"
          preload="metadata"
          autoPlay
          playsInline
          muted
          style={{ display: 'none' }}
        >
          <source src="/images/Main_1 - Trim.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
