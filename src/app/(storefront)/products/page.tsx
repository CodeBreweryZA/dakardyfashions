import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "All Products",
  description: "Browse our complete collection of fashion products.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { sort?: string; q?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const perPage = 12;
  const sort = searchParams.sort || "newest";

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "price-asc" ? { basePrice: "asc" as const } :
    sort === "price-desc" ? { basePrice: "desc" as const } :
    { createdAt: "desc" as const };

  const where = searchParams.q
    ? {
        isActive: true,
        OR: [
          { name: { contains: searchParams.q, mode: "insensitive" as const } },
          { description: { contains: searchParams.q, mode: "insensitive" as const } },
        ],
      }
    : { isActive: true };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        variants: { where: { isActive: true } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <a href={`/products?sort=newest${searchParams.q ? `&q=${searchParams.q}` : ""}`} className={`px-3 py-2 rounded-lg text-sm border ${sort === "newest" ? "bg-brand-gold text-white border-brand-gold" : "border-gray-300 hover:bg-gray-50"}`}>Newest</a>
          <a href={`/products?sort=price-asc${searchParams.q ? `&q=${searchParams.q}` : ""}`} className={`px-3 py-2 rounded-lg text-sm border ${sort === "price-asc" ? "bg-brand-gold text-white border-brand-gold" : "border-gray-300 hover:bg-gray-50"}`}>Price ↑</a>
          <a href={`/products?sort=price-desc${searchParams.q ? `&q=${searchParams.q}` : ""}`} className={`px-3 py-2 rounded-lg text-sm border ${sort === "price-desc" ? "bg-brand-gold text-white border-brand-gold" : "border-gray-300 hover:bg-gray-50"}`}>Price ↓</a>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/products?page=${p}${sort !== "newest" ? `&sort=${sort}` : ""}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                p === page
                  ? "bg-brand-gold text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
