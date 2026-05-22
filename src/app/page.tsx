import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import { getAboutContent, getProductsContent } from '@/lib/markdown';

export default async function Home() {
  const [aboutContent, products] = await Promise.all([
    getAboutContent(),
    getProductsContent(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About content={aboutContent} />
        <Products products={products} />
      </main>
      <Footer />
    </>
  );
}
