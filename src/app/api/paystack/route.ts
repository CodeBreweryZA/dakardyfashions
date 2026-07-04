import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: (session.user as any).id },
      include: { payment: true },
    });

    if (!order || order.payment.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payment = order.payment[0];
    if (payment.method !== "PAYSTACK") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const res = await fetch("https://api.paystack.compan.stack.com/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: Math.round(Number(payment.amount) * 100),
        currency: "ZAR",
        reference: order.orderNumber,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      }),
    });

    const data = await res.json();
    if (!data.status) {
      throw new Error(data.message || "Paystack initialization failed");
    }

    return NextResponse.json({ authorizationUrl: data.data.authorization_url, reference: data.data.reference });
  } catch (error) {
    console.error("Paystack error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}