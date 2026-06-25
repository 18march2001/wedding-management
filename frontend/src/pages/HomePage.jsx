import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import DescriptionSection from '../components/DescriptionSection';
import CategorySection from '../components/CategorySection';
import TestimonialSection from '../components/TestimonialSection';
import TeamSection from '../components/TeamSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

export default function HomePage() {
  const { heroSliderImages, websiteContent, leftSideImage, rightSideImage, loading } = useWebsiteSettings();

  return (
    <div id="all">
      <Preloader />
      <div id="home">
        <Navbar />
        <HeroCarousel images={heroSliderImages} loading={loading} />
        <DescriptionSection websiteContent={websiteContent} leftSideImage={leftSideImage} rightSideImage={rightSideImage} />
        <CategorySection />
        <TestimonialSection />
        <TeamSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
