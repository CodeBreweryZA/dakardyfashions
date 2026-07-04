"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Banknote, Truck, CheckCircle, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { CheckoutSteps } from "./CheckoutSteps";
import { ShippingForm } from "./ShippingForm";
import { DeliveryMethodForm } from "./DeliveryMethodForm";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { OrderSummary } from "./OrderSummary";

const STEPS = [
  { id: 1, label: "Shipping", icon: Truck },
  { id: 2, label: "Delivery", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
];

export default function CheckoutPage() {
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    fullName: "", email: "", phone: "", street: "", city: "", province: "", postalCode: ""
  });
  const [deliveryMethodId, setDeliveryMethodId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAYFAST" | "YOCO" | "PAYSTACK" | "MANUAL_EFT">("PAYFAST");

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500 mb-6">Your cart is empty</p>
        <Link href="/products" className="btn-primary inline-block">Continue Shopping</Link>
      >
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      items: items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shipping,
      deliveryMethodId,
      paymentMethod,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        
        if (paymentMethod === "PAYFAST" || paymentMethod === "YOCO" || paymentMethod === "PAYSTACK") {
          router.push(`/checkout/payment/${data.orderId}?method=${paymentMethod}`);
        } else {
          router.push(`/checkout/manual-eft/${data.orderId}`);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <CheckoutSteps currentStep={step} steps={STEPS} />
      
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <ShippingForm
              shipping={shipping}
              setShipping={setShipping}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <DeliveryMethodForm
              deliveryMethodId={deliveryMethodId}
              setDeliveryMethodId={setDeliveryMethodId}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <PaymentMethodForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary items={items} subtotal={subtotal} deliveryMethodId={deliveryMethodId} />
        </div>
      </div>
    </div>
  );
}