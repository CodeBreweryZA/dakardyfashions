import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, Heart, MapPin, CreditCard } from "lucide-react";

async function getUserData(userId: string) {
  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { take: 1 }, payment: true },
    }),
    prisma.address.findMany({ where: { userId } }),
  ]);
  return { orders, addresses };
}

export default async function AccountDashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const { orders, addresses } = await getUserData(userId!);

  const stats = [
    { label: "Orders", value: orders.length, icon: Package, href: "/account/orders" },
    { label: "Wishlist", value: 0, icon: Heart, href: "/account/wishlist" },
    { label: "Addresses", value: addresses.length, icon: MapPin, href: "/account/addresses" },
    { label: "Payment Methods", value: 0, icon: CreditCard, href: "/account/settings" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-brand-gold/10 p-3 rounded-lg">
                <stat.icon className="h-6 w-6 text-brand-gold" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-brand-gold hover:underline">View All</Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Link href="/products" className="btn-primary inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.items[0]?.productName || "Order"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}