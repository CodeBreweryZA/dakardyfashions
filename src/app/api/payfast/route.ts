import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAYFAST_URL = process.env.PAYFAST_SANDBOX === "true"
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

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
    if (payment.method !== "PAYFAST") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE;

    const params = new URLSearchParams({
      merchant_id: merchantId || "",
      merchant_key: merchantKey || "",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?orderId=${order.id}`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payfast`,
      name_first: order.shippingAddress?.fullName.split(" ")[0] || "Customer",
      name_last: order.shippingAddress?.fullName.split(" ").slice(1).join(" ") || "",
      email_address: session.user.email || "",
      m_payment_id: order.orderNumber,
      amount: Number(payment.amount).toFixed(2),
      item_name: `DakardyFashions Order ${order.orderNumber}`,
    });

    if (passphrase) {
      params.set("passphrase", passphrase);
    }

    return NextResponse.json({ url: `${PAYFAST_URL}?${params.toString()}` });
  } catch (error) {
    console.error("PayFast error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}