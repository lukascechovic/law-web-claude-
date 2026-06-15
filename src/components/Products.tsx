import type { Product } from '@/lib/products';
import type { ProductsSection } from '@/lib/productsSection';
import ProductCard from './ProductCard';
import RevealOnScroll from './RevealOnScroll';

interface ProductsProps {
  products: Product[];
  section: ProductsSection;
}

export default function Products({ products, section }: ProductsProps) {
  return (
    <section
      id="products"
      data-testid="products-section"
      className="py-24 px-6 bg-cream-100/75"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <RevealOnScroll className="text-center mb-20" repeat>
          <p className="section-label mb-3">{section.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 leading-tight">
            {section.heading}
          </h2>
          <p className="mt-4 font-sans text-stone-mid max-w-xl mx-auto text-base leading-relaxed">
            {section.subheading}
          </p>
        </RevealOnScroll>

        {/* Product list */}
        <div className="flex flex-col gap-28">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} reverse={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
