import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();
    
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex");

    if (signature !== hash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { event, data } = JSON.parse(body);

    if (event === "charge.success") {
      const { reference, id, amount } = data;
      const order = await prisma.order.findFirst({
        where: { orderNumber: reference },
        include: { payment: true },
      });

      if (!order || order.payment.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const payment = order.payment[0];
      if (payment.method !== "PAYSTACK") {
        return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            transactionId: id.toString(),
            metadata: { ...payment.metadata, paystack: data },
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        }),
      ]);
    } else if (event === "charge.failed") {
      const { reference, id } = data;
      const order = await prisma.order.findFirst({
        where: { orderNumber: reference },
        include: { payment: true },
      });

      if (order?.payment?.[0]) {
        await prisma.payment.update({
          where: { id: order.payment[0].id },
          data: { status: "FAILED", metadata: { ...order.payment[0].metadata, paystack: data } },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}