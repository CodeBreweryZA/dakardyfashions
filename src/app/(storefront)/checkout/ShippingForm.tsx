"use client";

import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number required"),
  street: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City required"),
  province: z.string().min(2, "Province required"),
  postalCode: z.string().min(4, "Postal code required"),
});

type ShippingData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  shipping: ShippingData;
  setShipping: (data: ShippingData) => void;
  onNext: () => void;
}

export function ShippingForm({ shipping, setShipping, onNext }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shipping,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit((data) => { setShipping(data); onNext(); })} className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Shipping Information</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input {...register("fullName")} className="input-field" />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input {...register("email")} type="email" className="input-field" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input {...register("phone")} type="tel" className="input-field" />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street Address *</label>
        <input {...register("street")} className="input-field" />
        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <input {...register("city")} className="input-field" />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Province *</label>
          <select {...register("province")} className="input-field">
            <option value="">Select province</option>
            <option value="Gauteng">Gauteng</option>
            <option value="Western Cape">Western Cape</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="North West">North West</option>
          </select>
          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code *</label>
          <input {...register("postalCode")} className="input-field" />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn-primary w-full">Continue to Delivery</button>
    </form>
  );
}