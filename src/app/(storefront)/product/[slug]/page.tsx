import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: { select: { name: true } } },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — DakardyFashions`,
    description: product.description || `${product.name} at DakardyFashions.`,
    openGraph: {
      title: product.name,
      description: product.description || "",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: { select: { name: true, slug: true } },
      variants: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!product || !product.isActive) notFound();

  const colors = [...new Map(product.variants.filter(v => v.color).map(v => [v.color, v])).values()];
  const sizes = [...new Map(product.variants.filter(v => v.size).map(v => [v.size, v])).values()];

  const firstVariant = product.variants[0];
  const currentPrice = firstVariant?.price || product.basePrice;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      price: Number(currentPrice),
      priceCurrency: "ZAR",
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">{product.category.name.charAt(0)}</span>
                </div>
                <p>Product Image</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-brand-gold font-semibold uppercase tracking-wide mb-2">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-brand-gold mb-6">
              {formatPrice(currentPrice)}
            </p>

            {product.description && (
              <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            )}

            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Color</h3>
                <div className="flex gap-2">
                  {colors.map((v) => (
                    <button
                      key={v.color}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-brand-gold transition-colors"
                      style={{ backgroundColor: v.colorHex || "#ccc" }}
                      title={v.color || ""}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((v) => (
                    <button
                      key={v.size}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-brand-gold hover:text-brand-gold transition-colors"
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton
              variant={{
                id: firstVariant?.id || "",
                productId: product.id,
                name: product.name,
                image: product.images[0] || null,
                size: firstVariant?.size || null,
                color: firstVariant?.color || null,
                sku: firstVariant?.sku || "",
                price: Number(currentPrice),
                stock: firstVariant?.stock || 0,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
