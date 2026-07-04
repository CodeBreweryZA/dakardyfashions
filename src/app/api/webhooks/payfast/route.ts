import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const {
      m_payment_id,
      pf_payment_id,
      payment_status,
      signature,
      merchant_id,
      amount_gross,
    } = data;

    const order = await prisma.order.findFirst({
      where: { orderNumber: m_payment_id as string },
      include: { payment: true },
    });

    if (!order || order.payment.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payment = order.payment[0];
    if (payment.method !== "PAYFAST") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (payment_status === "COMPLETE") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            transactionId: pf_payment_id as string,
            metadata: { ...payment.metadata, payfast: data },
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        }),
      ]);
    } else if (["FAILED", "CANCELLED"].includes(payment_status as string)) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          metadata: { ...payment.metadata, payfast: data },
        },
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("PayFast webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}