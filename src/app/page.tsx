import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Process from '@/components/Process';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import BackgroundComponents from '@/components/ui/background-components';
import { getAboutContent } from '@/lib/markdown';
import { getProducts } from '@/lib/products';
import { getProcess } from '@/lib/process';
import { getGallery } from '@/lib/gallery';
import { getHeroVideoConfig } from '@/lib/heroVideo';

export default async function Home() {
  const aboutContent = await getAboutContent();
  const products = getProducts();
  const heroVideo = getHeroVideoConfig();

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
            <Process process={getProcess()} />
            <Gallery items={getGallery()} />
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
