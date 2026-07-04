import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} — DakardyFashions`,
    description: category.description || `Shop ${category.name} collection at DakardyFashions.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string; page?: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { children: true },
  });

  if (!category) notFound();

  const page = parseInt(searchParams.page || "1");
  const perPage = 12;
  const sort = searchParams.sort || "newest";

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "price-asc" ? { basePrice: "asc" as const } :
    sort === "price-desc" ? { basePrice: "desc" as const } :
    { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: { in: categoryIds }, isActive: true },
      include: {
        category: { select: { name: true } },
        variants: { where: { isActive: true } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({
      where: { categoryId: { in: categoryIds }, isActive: true },
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500">{category.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-gray-500">{total} products</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <a href={`/category/${params.slug}?sort=newest`} className={`px-3 py-2 rounded-lg text-sm border ${sort === "newest" ? "bg-brand-gold text-white border-brand-gold" : "border-gray-300 hover:bg-gray-50"}`}>Newest</a>
          <a href={`/category/${params.slug}?sort=price-asc`} className={`px-3 py-2 rounded-lg text-sm border ${sort === "price-asc" ? "bg-brand-gold text-white border-brand-gold" : "border-gray-300 hover:bg-gray-50"}`}>Price ↑</a>
          <a href={`/category/${params.slug}?sort=price-desc`} className={`px-3 py-2 rounded-lg text-sm border ${sort === "price-desc" ? "bg-brand-gold text-white border-brand-gold" : "border-gray-300 hover:bg-gray-50"}`}>Price ↓</a>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No products found in this category</p>
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
              href={`/category/${params.slug}?page=${p}${sort !== "newest" ? `&sort=${sort}` : ""}`}
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
