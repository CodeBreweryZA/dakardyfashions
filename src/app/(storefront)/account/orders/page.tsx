import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true, shippingAddress: true, deliveryMethod: true },
  });
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const orders = await getOrders(userId!);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
          <Link href="/products" className="btn-primary inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-gold/10 rounded-lg">
                      <ChevronRight className="h-6 w-6 text-brand-gold" />
                    </div>
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {order.createdAt.toLocaleDateString()} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right md:text-left">
                    <div>
                      <p className="text-2xl font-bold text-brand-gold">{formatPrice(order.total)}</p>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        order.status === "PAID" ? "bg-green-100 text-green-700" :
                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                        order.status === "DELIVERED" ? "bg-gray-100 text-gray-700" :
                        order.status === "PENDING_VERIFICATION" ? "bg-amber-100 text-amber-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}