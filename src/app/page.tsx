import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import BackgroundComponents from '@/components/ui/background-components';
import { getAboutContent, getProductsContent } from '@/lib/markdown';
import { getHeroVideoConfig } from '@/lib/heroVideo';

export default async function Home() {
  const [aboutContent, products, heroVideo] = await Promise.all([
    getAboutContent(),
    getProductsContent(),
    Promise.resolve(getHeroVideoConfig()),
  ]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main>
        <Hero videoSrc={heroVideo.src} videoPosition={heroVideo.objectPosition} />
        <div className="relative">
          <BackgroundComponents className="absolute inset-0" />
          <div className="relative z-10">
            <About content={aboutContent} />
            <Products products={products} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
