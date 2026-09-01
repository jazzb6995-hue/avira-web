import { ProductCard, type ProductCardData } from "@/components/ui/ProductCard";

interface Props {
  heading: string;
  products: ProductCardData[];
}

export function RelatedProducts({ heading, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="font-[var(--font-display)] text-2xl text-center mb-8">{heading}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
