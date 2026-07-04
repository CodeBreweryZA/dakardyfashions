"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";

export default function PaymentRedirect() {
  const params = useParams();
  const router = useRouter();
  const method = params.method as string;
  const orderId = new URLSearchParams(window.location.search).get("orderId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initiatePayment = async () => {
      if (!orderId) {
        setError("Order ID missing");
        setLoading(false);
        return;
      }

      try {
        const endpoint = method === "PAYFAST" ? "/api/payfast" : 
                        method === "YOCO" ? "/api/yoco" : "/api/paystack";
        
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Payment initialization failed");
        }

        if (method === "PAYFAST" && data.url) {
          window.location.href = data.url;
        } else if (method === "YOCO" && data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (method === "PAYSTACK" && data.authorizationUrl) {
          window.location.href = data.authorizationUrl;
        } else {
          throw new Error("No redirect URL received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
        setLoading(false);
      }
    };

    initiatePayment();
  }, [method, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-gold mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Redirecting to {method}...</h2>
          <p className="text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="max-w-md w-full text-center">
        <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Error</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => router.push("/checkout")}
          className="btn-primary w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}