import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { User, Package, ShoppingBag, Heart, LogOut, Settings } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b">
          <Link href="/account" className="text-xl font-bold">
            <span className="text-brand-gold">DKF</span> Account
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/account" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <User className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/account/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-5 w-5" />
            <span>My Orders</span>
          </Link>
          <Link href="/account/addresses" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span>Addresses</span>
          </Link>
          <Link href="/account/wishlist" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>
          <Link href="/account/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <LogOut className="h-4 w-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}