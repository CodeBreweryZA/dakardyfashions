import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "checkout.completed") {
      const { id, metadata, amount } = data;
      const orderId = metadata?.orderId;

      if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order || order.payment.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const payment = order.payment[0];
      if (payment.method !== "YOCO") {
        return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            transactionId: id,
            metadata: { ...payment.metadata, yoco: data },
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        }),
      ]);
    } else if (type === "checkout.failed") {
      const { id, metadata } = data;
      const orderId = metadata?.orderId;

      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { payment: true },
        });

        if (order?.payment?.[0]) {
          await prisma.payment.update({
            where: { id: order.payment[0].id },
            data: { status: "FAILED", metadata: { ...order.payment[0].metadata, yoco: data } },
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Yoco webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}