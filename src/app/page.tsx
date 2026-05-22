import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import { getAboutContent, getProductsContent } from '@/lib/markdown';
import { getHeroVideoConfig } from '@/lib/heroVideo';

export default async function Home() {
  const [aboutContent, products, heroVideo] = await Promise.all([
    getAboutContent(),
    getProductsContent(),
    Promise.resolve(getHeroVideoConfig()),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero videoSrc={heroVideo.src} videoPosition={heroVideo.objectPosition} />
        <About content={aboutContent} />
        <Products products={products} />
      </main>
      <Footer />
    </>
  );
}
