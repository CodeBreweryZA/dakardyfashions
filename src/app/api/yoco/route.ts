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
    if (payment.method !== "YOCO") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const res = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Secret-Key": process.env.YOCO_SECRET_KEY || "",
      },
      body: JSON.stringify({
        amount: Math.round(Number(payment.amount) * 100),
        currency: "ZAR",
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?orderId=${order.id}`,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Yoco checkout failed");
    }

    return NextResponse.json({ id: data.id, redirectUrl: data.redirectUrl });
  } catch (error) {
    console.error("Yoco error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}