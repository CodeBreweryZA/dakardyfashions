"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="max-w-md w-full text-center">
        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-6">
          Your payment was not completed. Your order has been saved but remains unpaid.
        </p>
        {orderId && <p className="text-sm text-gray-400 mb-8">Order ID: {orderId}</p>}
        <div className="space-y-3">
          <Link href="/cart" className="btn-primary w-full block">Return to Cart</Link>
          <Link href="/account/orders" className="btn-outline w-full block">View Orders</Link>
        </div>
      </div>
    </div>
  );
}