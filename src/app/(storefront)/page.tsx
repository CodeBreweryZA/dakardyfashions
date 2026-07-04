import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      category: { select: { name: true } },
      variants: { where: { isActive: true } },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative bg-brand-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Elevate Your
              <span className="text-brand-gold"> Style</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Discover premium fashion curated for the modern individual. From classic tailoring to contemporary streetwear — find your look at DakardyFashions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/category/men" className="btn-primary text-center">
                Shop Men
              </Link>
              <Link href="/category/women" className="btn-outline border-white text-white hover:bg-white hover:text-brand-charcoal text-center">
                Shop Women
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-gold font-bold text-lg">
                    {cat.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-brand-gold font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const minPrice = Math.min(
                ...product.variants.map((v) => Number(v.price || product.basePrice))
              );
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">{product.category.name.charAt(0)}</span>
                        </div>
                        <p className="text-sm">Product Image</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-brand-gold font-bold">{formatPrice(minPrice)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-charcoal rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Free Shipping Over R500
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Enjoy free standard delivery on all orders over R500. Express delivery also available for next-day service.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
