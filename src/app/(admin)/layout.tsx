import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-brand-charcoal text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            <span className="text-brand-gold">DKF</span> Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Package className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link href="/admin/customers" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Users className="h-5 w-5" />
            <span>Customers</span>
          </Link>
          <Link href="/admin/reports" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <BarChart3 className="h-5 w-5" />
            <span>Reports</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
            <LogOut className="h-4 w-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
