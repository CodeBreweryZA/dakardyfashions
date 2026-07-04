import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId, userId: (session.user as any).id },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payment = order.payment[0];
    if (!payment || payment.method !== "MANUAL_EFT") {
      return NextResponse.json({ error: "Not a manual EFT order" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("proofOfPayment") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // In production, upload to Cloudinary/S3 and store URL
    // For now, just update payment metadata with file info
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          ...payment.metadata,
          proofOfPayment: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Proof of payment upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}