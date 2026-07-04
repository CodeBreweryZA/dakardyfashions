"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

export function CartSidebar() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === "cart-trigger" || target.closest("#cart-trigger")) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cart ({itemCount})</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.productName}</h4>
                    {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                    <p className="text-brand-gold font-semibold text-sm">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="ml-auto p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center block"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="btn-outline w-full text-center block"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
