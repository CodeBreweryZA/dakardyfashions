"use client";

import { useEffect, useState } from "react";
import { Truck, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DeliveryMethodFormProps {
  deliveryMethodId: string;
  setDeliveryMethodId: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DeliveryMethodForm({ deliveryMethodId, setDeliveryMethodId, onBack, onNext }: DeliveryMethodFormProps) {
  const [methods, setMethods] = useState<Array<{
    id: string; name: string; code: string; description: string; price: number; estimatedDays: string;
  }>>([]);

  useEffect(() => {
    fetch("/api/delivery-methods")
      .then(r => r.json())
      .then(data => setMethods(data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Delivery Method</h2>
        <button onClick={onBack} className="text-brand-gold hover:underline">Back</button>
      </div>

      {methods.length === 0 ? (
        <p className="text-gray-500">Loading delivery methods...</p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <label key={method.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              deliveryMethodId === method.id ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200 hover:border-brand-gold'}`}>
              <input
                type="radio"
                name="delivery"
                value={method.id}
                checked={deliveryMethodId === method.id}
                onChange={() => setDeliveryMethodId(method.id)}
                className="h-4 w-4 text-brand-gold border-gray-300 focus:ring-brand-gold"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{method.name}</span>
                  <span className="text-brand-gold font-bold">{formatPrice(method.price)}</span>
                </div>
                <p className="text-sm text-gray-500">{method.description} · {method.estimatedDays} days</p>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-outline">Back</button>
        <button
          onClick={onNext}
          disabled={!deliveryMethodId}
          className="btn-primary"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}