"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const HomeIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={filled ? "white" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={filled ? "white" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BagIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={filled ? "white" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();
  const cart = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isHome = pathname === "/";
  const isWishlist = pathname === "/wishlist";
  const isCart = pathname === "/cart";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080808]/95 backdrop-blur-md border-t border-[#1c1c1c]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-4">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 py-2 px-4"
          aria-label="Home"
        >
          <span className={isHome ? "text-white" : "text-[#555]"}>
            <HomeIcon filled={isHome} />
          </span>
          <span
            className={`text-[10px] font-medium tracking-wide ${isHome ? "text-white" : "text-[#555]"}`}
          >
            Home
          </span>
        </Link>

        <Link
          href="/wishlist"
          className="flex flex-col items-center gap-0.5 py-2 px-4 relative"
          aria-label="Wishlist"
        >
          <span
            className={`relative ${isWishlist ? "text-white" : "text-[#555]"}`}
          >
            <HeartIcon filled={isWishlist} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </span>
          <span
            className={`text-[10px] font-medium tracking-wide ${isWishlist ? "text-white" : "text-[#555]"}`}
          >
            Wishlist
          </span>
        </Link>

        <Link
          href="/cart"
          className="flex flex-col items-center gap-0.5 py-2 px-4 relative"
          aria-label="Cart"
        >
          <span className={`relative ${isCart ? "text-white" : "text-[#555]"}`}>
            <BagIcon filled={isCart} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </span>
          <span
            className={`text-[10px] font-medium tracking-wide ${isCart ? "text-white" : "text-[#555]"}`}
          >
            Cart
          </span>
        </Link>
        <Link
          href="/admin"
          className="flex flex-col items-center gap-0.5 py-2 px-4 relative"
          aria-label="Cart"
        >
          <span className={`relative ${isCart ? "text-white" : "text-[#555]"}`}>
            <BagIcon filled={isCart} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </span>
          <span
            className={`text-[10px] font-medium tracking-wide ${isCart ? "text-white" : "text-[#555]"}`}
          >
            Admin
          </span>
        </Link>
      </div>
    </nav>
  );
}
