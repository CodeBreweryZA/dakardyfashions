"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  items: Array<{
    variantId: string;
    productName: string;
    productImage: string | null;
    size: string | null;
    color: string | null;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryMethodId: string;
}

export function OrderSummary({ items, subtotal, deliveryMethodId }: OrderSummaryProps) {
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryMethods, setDeliveryMethods] = useState<Array<{id: string, price: number}>>([]);

  useEffect(() => {
    fetch("/api/delivery-methods")
      .then(r => r.json())
      .then(data => setDeliveryMethods(data));
  }, []);

  useEffect(() => {
    const method = deliveryMethods.find(m => m.id === deliveryMethodId);
    setShippingCost(method?.price || 0);
  }, [deliveryMethodId, deliveryMethods]);

  const tax = subtotal * 0.15;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0">
              {item.productImage ? (
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.productName}</p>
              <p className="text-xs text-gray-500">
                {item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`}
              </p>
              <p className="text-sm font-medium text-brand-gold">{formatPrice(item.price)} × {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Shipping
          </span>
          <span>{formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tax (15% VAT)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}