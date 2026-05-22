import type { Product } from '@/lib/markdown';
import ProductCard from './ProductCard';

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
  return (
    <section
      id="products"
      data-testid="products-section"
      className="py-24 px-6 bg-cream-100/75"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="section-label mb-3">The Collection</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 leading-tight">
            Gear Built for Riders
          </h2>
          <p className="mt-4 font-sans text-stone-mid max-w-xl mx-auto text-base leading-relaxed">
            Each piece is engineered for horseback archery — functional,
            personal, and ready to perform.
          </p>
        </div>

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
