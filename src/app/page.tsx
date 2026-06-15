import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Process from '@/components/Process';
import Videos from '@/components/Videos';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import BackgroundComponents from '@/components/ui/background-components';
import { getAboutContent } from '@/lib/markdown';
import { getProducts } from '@/lib/products';
import { productToJsonLd } from '@/lib/jsonld';
import { getProcess } from '@/lib/process';
import { getVideos } from '@/lib/videos';
import { getGallery } from '@/lib/gallery';
import { getReviews } from '@/lib/reviews';
import { getFaq } from '@/lib/faq';
import { getHeroVideoConfig } from '@/lib/heroVideo';
import { getAboutImages } from '@/lib/about';
import { getHeroContent } from '@/lib/heroContent';
import { getProductsSection } from '@/lib/productsSection';

export default async function Home() {
  const aboutContent = await getAboutContent();
  const aboutImages = getAboutImages();
  const products = getProducts();
  const heroVideo = getHeroVideoConfig();
  const heroContent = getHeroContent();
  const productsSection = getProductsSection();

  return (
    <>
      {products.map(product => (
        <script
          key={product.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productToJsonLd(product)) }}
        />
      ))}
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main>
        <Hero videoSrc={heroVideo.src} videoPosition={heroVideo.objectPosition} {...heroContent} />
        <div className="relative">
          <BackgroundComponents className="absolute inset-0" />
          <div className="relative z-10">
            <About content={aboutContent} images={aboutImages} />
            <Products products={products} section={productsSection} />
            <Process process={getProcess()} />
            <Videos {...getVideos()} />
            <Gallery {...getGallery()} />
            <Reviews {...getReviews()} />
            <Faq faq={getFaq()} />
          </div>
        </div>
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
    </>
  );
}
