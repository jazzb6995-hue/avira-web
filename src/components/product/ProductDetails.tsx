interface Props {
  product: any;
}

export function ProductDetails({ product }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12" id="details">
      {/* Description */}
      <div>
        <h2 className="font-[var(--font-display)] text-xl mb-4">About this piece</h2>
        {product.shortDescription && (
          <p className="text-sm text-[var(--color-warm-grey)] italic mb-4 leading-relaxed">
            {product.shortDescription}
          </p>
        )}
        {product.longDescription && (
          <div
            className="text-sm text-[var(--color-charcoal)] leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: product.longDescription }}
          />
        )}
      </div>

      {/* Specs */}
      <div>
        <h2 className="font-[var(--font-display)] text-xl mb-4">Details</h2>
        <dl className="space-y-3">
          {[
            ["SKU", product.sku],
            ["Material", product.material],
            ["Plating", product.plating],
            ["Stone", product.stone],
            ["Dimensions", product.dimensions],
            ["Style", product.style],
            ["Occasion", product.occasion],
          ]
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <div key={label} className="flex gap-4 text-sm border-b border-[var(--color-border)] pb-2">
                <dt className="w-28 flex-shrink-0 text-[var(--color-warm-grey)] uppercase tracking-wider text-xs">
                  {label}
                </dt>
                <dd className="text-[var(--color-charcoal)]">{value}</dd>
              </div>
            ))}
        </dl>

        {product.careInstructions && (
          <div className="mt-6">
            <h3 className="font-[var(--font-display)] text-base mb-2">Jewellery Care</h3>
            <p className="text-sm text-[var(--color-warm-grey)] leading-relaxed">
              {product.careInstructions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
