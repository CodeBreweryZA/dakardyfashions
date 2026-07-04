"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  const [status, setStatus] = useState<"checking" | "success" | "pending" | "error">("checking");

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "PAID") setStatus("success");
          else if (data.status === "PENDING_VERIFICATION") setStatus("pending");
          else setStatus("checking");
        }
      } catch {
        setStatus("error");
      }
    };

    const interval = setInterval(checkStatus, 3000);
    checkStatus();
    return () => clearInterval(interval);
  }, [orderId]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-gold mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Verifying payment...</h2>
          <p className="text-gray-500 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6">Your payment has been processed successfully.</p>
          <p className="text-sm text-gray-400 mb-8">Order ID: {orderId}</p>
          <div className="space-y-3">
            <Link href="/account/orders" className="btn-primary w-full block">View Order</Link>
            <Link href="/products" className="btn-outline w-full block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Pending</h1>
          <p className="text-gray-500 mb-6">Your order is awaiting payment verification.</p>
          <p className="text-sm text-gray-400 mb-8">Order ID: {orderId}</p>
          <Link href="/account/orders" className="btn-primary w-full block">View Order Details</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="max-w-md w-full text-center">
        <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✕</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Issue</h1>
        <p className="text-gray-500 mb-6">We couldn't verify your payment status.</p>
        <Link href="/account/orders" className="btn-primary w-full block">Check Order Status</Link>
      </div>
    </div>
  );
}