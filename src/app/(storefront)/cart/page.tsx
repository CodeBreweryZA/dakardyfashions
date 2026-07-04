"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="animate-pulse h-64" />;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount})</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link href="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">Items</h2>
              </div>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.variantId} className="p-4 flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`} className="font-medium hover:text-brand-gold">
                        {item.productName}
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        {item.sku && <span>SKU: {item.sku}</span>}
                      </div>
                      <p className="text-brand-gold font-semibold mt-2">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="mt-2 text-sm text-gray-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Link href="/products" className="btn-outline">
                Continue Shopping
              </Link>
              <Link href="/checkout" className="btn-primary">
                Proceed to Checkout
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax (15% VAT)</span>
                  <span>{formatPrice(subtotal * 0.15)}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal * 1.15)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Includes 15% VAT. Shipping calculated at checkout.</p>
              </div>
              <Link href="/checkout" className="btn-primary w-full text-center mt-4 block">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
