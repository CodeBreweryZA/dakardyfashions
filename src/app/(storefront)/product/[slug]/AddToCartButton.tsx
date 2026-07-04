"use client";

import { useCartStore } from "@/lib/cart-store";

interface AddToCartButtonProps {
  variant: {
    id: string;
    productId: string;
    name: string;
    image: string | null;
    size: string | null;
    color: string | null;
    sku: string;
    price: number;
    stock: number;
  };
}

export function AddToCartButton({ variant }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const outOfStock = variant.stock === 0;

  return (
    <button
      onClick={() =>
        addItem({
          variantId: variant.id,
          productId: variant.productId,
          productName: variant.name,
          productImage: variant.image,
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
        })
      }
      disabled={outOfStock}
      className="btn-primary w-full text-lg py-4"
    >
      {outOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
