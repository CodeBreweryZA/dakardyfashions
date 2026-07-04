import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    basePrice: string | number;
    category: { name: string };
    variants: Array<{
      id: string;
      size: string | null;
      color: string | null;
      colorHex: string | null;
      price: string | number | null;
      stock: number;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(
    ...product.variants.map((v) => Number(v.price || product.basePrice))
  );
  const hasStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200"
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
        {!hasStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category.name}</p>
        <h3 className="font-semibold mb-2 group-hover:text-brand-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          {product.variants.filter((v) => v.colorHex).slice(0, 4).map((v) => (
            <span
              key={v.id}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: v.colorHex || "#ccc" }}
              title={v.color || ""}
            />
          ))}
        </div>
        <p className="text-brand-gold font-bold">{formatPrice(minPrice)}</p>
      </div>
    </Link>
  );
}
