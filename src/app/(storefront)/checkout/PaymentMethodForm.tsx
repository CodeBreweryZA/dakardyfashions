"use client";

import { CreditCard, Banknote, Shield, CheckCircle } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "PAYFAST", name: "PayFast", desc: "Credit/Debit Card & Instant EFT", icon: CreditCard },
  { id: "YOCO", name: "Yoco", desc: "Secure card payments", icon: CreditCard },
  { id: "PAYSTACK", name: "Paystack", desc: "Card & mobile money payments", icon: CreditCard },
  { id: "MANUAL_EFT", name: "Bank Transfer (EFT)", desc: "Manual EFT - proof of payment required", icon: Banknote },
] as const;

type PaymentMethod = typeof PAYMENT_METHODS[number]["id"];

interface PaymentMethodFormProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PaymentMethodForm({ paymentMethod, setPaymentMethod, onBack, onSubmit }: PaymentMethodFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <button type="button" onClick={onBack} className="text-brand-gold hover:underline">Back</button>
      </div>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <label key={method.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
            paymentMethod === method.id ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200 hover:border-brand-gold'}`}>
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id as PaymentMethod)}
              className="h-4 w-4 text-brand-gold border-gray-300 focus:ring-brand-gold"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <method.icon className="h-5 w-5 text-brand-gold" />
                <span className="font-medium">{method.name}</span>
              </div>
              <p className="text-sm text-gray-500">{method.desc}</p>
            </div>
            <CheckCircle className={`h-5 w-5 ml-auto ${paymentMethod === method.id ? 'text-brand-gold' : 'text-transparent'}`} />
          </label>
        ))}
      </div>

      {paymentMethod === "MANUAL_EFT" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Bank Transfer Details</h4>
          <div className="space-y-1 text-sm text-amber-700">
            <p><strong>Account Holder:</strong> LD PHAAHLA</p>
            <p><strong>Account Number:</strong> 51045370183</p>
            <p><strong>Branch Code:</strong> 678910</p>
            <p><strong>Reference:</strong> Your Order Number (provided after placing order)</p>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            After placing your order, upload proof of payment in your order details. 
            Order will remain pending until verified by admin.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="btn-outline">Back</button>
        <button type="submit" className="btn-primary">Place Order</button>
      </div>
    </form>
  );
}