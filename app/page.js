






import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import HowItWorks from './Components/HowItsWorks';
import FeaturedDestinations from './Components/FeaturedDestinations';
import TravelPlanner from './Components/TravelPlanner';
import Testimonials from './Components/Testimonials';
import Footer from './Components/Footer';

export default function Home() {
  return (
    <main style={{ background: 'var(--dusk)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      
      <HowItWorks />
      <FeaturedDestinations />
      <TravelPlanner />
      
      <Testimonials />
      <Footer />
    </main>
  );
}