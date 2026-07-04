"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, User } from "lucide-react";
import { CartSidebar } from "@/components/cart/CartSidebar";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="lg:hidden p-2" id="mobile-menu-btn">
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-brand-gold">DAKARDY</span>
              <span className="text-white">FASHIONS</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/category/men" className="text-sm font-medium hover:text-brand-gold transition-colors">
                Men
              </Link>
              <Link href="/category/women" className="text-sm font-medium hover:text-brand-gold transition-colors">
                Women
              </Link>
              <Link href="/category/kids" className="text-sm font-medium hover:text-brand-gold transition-colors">
                Kids
              </Link>
              <Link href="/category/shoes" className="text-sm font-medium hover:text-brand-gold transition-colors">
                Shoes
              </Link>
              <Link href="/category/accessories" className="text-sm font-medium hover:text-brand-gold transition-colors">
                Accessories
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:text-brand-gold transition-colors" id="search-btn">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/auth/login" className="p-2 hover:text-brand-gold transition-colors">
                <User className="h-5 w-5" />
              </Link>
              <button id="cart-trigger" className="p-2 hover:text-brand-gold transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-charcoal text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center cart-count">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <CartSidebar />

      <footer className="bg-brand-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-brand-gold">DAKARDY</span>FASHIONS
              </h3>
              <p className="text-gray-400 text-sm">
                Premium fashion for the modern individual. Quality clothing, accessories, and more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/category/men" className="hover:text-brand-gold transition-colors">Men</Link></li>
                <li><Link href="/category/women" className="hover:text-brand-gold transition-colors">Women</Link></li>
                <li><Link href="/category/kids" className="hover:text-brand-gold transition-colors">Kids</Link></li>
                <li><Link href="/category/shoes" className="hover:text-brand-gold transition-colors">Shoes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-brand-gold transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-brand-gold transition-colors">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@dakardyfashions.co.za</li>
                <li>+27 11 234 5678</li>
                <li>Johannesburg, South Africa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DakardyFashions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
