import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

async function getDashboardStats() {
  const [totalProducts, totalOrders, totalCustomers, totalRevenue] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { take: 1 },
    },
  });

  const lowStock = await prisma.productVariant.findMany({
    where: { stock: { lte: 5 }, isActive: true },
    include: { product: { select: { name: true } } },
    take: 10,
  });

  return { totalProducts, totalOrders, totalCustomers, totalRevenue: totalRevenue._sum.amount || 0, recentOrders, lowStock };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { title: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-500" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-green-500" },
    { title: "Customers", value: stats.totalCustomers, icon: Users, color: "bg-purple-500" },
    { title: "Revenue", value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: "bg-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user?.name || "Guest"}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-sm text-gray-400">No orders yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Low Stock Alerts</h2>
          <div className="space-y-3">
            {stats.lowStock.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{variant.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {variant.size && `${variant.size} - `}{variant.color}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${variant.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                  {variant.stock} left
                </span>
              </div>
            ))}
            {stats.lowStock.length === 0 && (
              <p className="text-sm text-gray-400">All stock levels are healthy</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
