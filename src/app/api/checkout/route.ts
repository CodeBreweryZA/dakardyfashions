import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateOrderNumber } from "@/lib/utils";

const checkoutSchema = z.object({
  items: z.array(z.object({
    variantId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  shipping: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    street: z.string().min(5),
    city: z.string().min(2),
    province: z.string().min(2),
    postalCode: z.string().min(4),
  }),
  deliveryMethodId: z.string(),
  paymentMethod: z.enum(["PAYFAST", "YOCO", "PAYSTACK", "MANUAL_EFT"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: data.items.map(i => i.variantId) } },
      include: { product: true },
    });

    if (variants.length !== data.items.length) {
      return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = data.items.map(item => {
      const variant = variants.find(v => v.id === item.variantId)!;
      const price = Number(variant.price || variant.product.basePrice);
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${variant.product.name}`);
      }
      subtotal += price * item.quantity;
      return { variant, quantity: item.quantity, price };
    });

    const deliveryMethod = await prisma.deliveryMethod.findUnique({
      where: { id: data.deliveryMethodId },
    });
    if (!deliveryMethod) {
      return NextResponse.json({ error: "Invalid delivery method" }, { status: 400 });
    }

    const shippingCost = Number(deliveryMethod.price);
    const tax = subtotal * 0.15;
    const total = subtotal + shippingCost + tax;

    const address = await prisma.address.create({
      data: {
        userId: (session.user as any).id,
        fullName: data.shipping.fullName,
        street: data.shipping.street,
        city: data.shipping.city,
        province: data.shipping.province,
        postalCode: data.shipping.postalCode,
        country: "South Africa",
        phone: data.shipping.phone,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: (session.user as any).id,
        status: data.paymentMethod === "MANUAL_EFT" ? "PENDING_VERIFICATION" : "PENDING",
        subtotal,
        shippingCost,
        tax,
        total,
        deliveryMethodId: data.deliveryMethodId,
        shippingAddressId: address.id,
        items: {
          create: orderItems.map(({ variant, quantity, price }) => ({
            variantId: variant.id,
            productName: variant.product.name,
            productImage: variant.product.images[0] || null,
            variantSize: variant.size,
            variantColor: variant.color,
            sku: variant.sku,
            quantity,
            unitPrice: price,
            totalPrice: price * quantity,
          })),
        },
        payment: {
          create: {
            method: data.paymentMethod,
            status: data.paymentMethod === "MANUAL_EFT" ? "VERIFYING" : "PENDING",
            amount: total,
            metadata: {},
          },
        },
      },
      include: { items: true, payment: true },
    });

    for (const { variant, quantity } of orderItems) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock: { decrement: quantity } },
      });
    }

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Insufficient stock")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}