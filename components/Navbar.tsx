"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";

import { clearUser } from "@/store/slics/auth";
import { clearCart } from "@/store/slics/cart";
import { clearWishlist } from "@/store/slics/wishlist";
import { setOrderCount } from "@/store/slics/orders";

import {
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiMenu,
  FiShield,
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const cart = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const orderCount = useSelector((state: RootState) => state.orders.orderCount);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const fetchOrderCount = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/getOrderCount`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        dispatch(setOrderCount(data.count));
      }
    } catch (error) {
      console.error("Failed to fetch navbar orders:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        localStorage.clear();

        dispatch(clearUser());
        dispatch(clearCart());
        dispatch(clearWishlist());
        dispatch(setOrderCount(0));

        localStorage.removeItem("lensco:cart");
        localStorage.removeItem("lensco:wishlist");
        localStorage.removeItem("lensco:orderCount");
        localStorage.removeItem("lensco:auth");

        setMenuOpen(false);

        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080808] backdrop-blur-md border-b border-[#1c1c1c]">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-['Fraunces'] text-xl font-semibold tracking-tight leading-none"
        >
          J<span className="text-[#888]">Optics</span>
        </Link>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              if (!menuOpen && user) {
                fetchOrderCount();
              }

              setMenuOpen(!menuOpen);
            }}
            className="relative p-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
            aria-label="Menu"
          >
            <FiMenu size={21} strokeWidth={1.5} className="text-white" />
          </button>

          {/* MENU POPUP */}
          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-52 rounded-lg border border-[#d1d5db] bg-[#ffffff] shadow-lg overflow-hidden">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#111827] hover:bg-[#f3f4f6] transition-colors"
              >
                <FiHeart size={18} />

                <span className="flex-1">Wishlist</span>

                {wishlistCount > 0 && (
                  <span className="bg-[#111827] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#111827] hover:bg-[#f3f4f6] transition-colors"
              >
                <FiShoppingCart size={18} />

                <span className="flex-1">Cart</span>

                {cartCount > 0 && (
                  <span className="bg-[#111827] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Orders */}
              <Link
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#111827] hover:bg-[#f3f4f6] transition-colors"
              >
                <FiPackage size={18} />

                <span className="flex-1">My Orders</span>

                {orderCount > 0 && (
                  <span className="bg-[#111827] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {orderCount}
                  </span>
                )}
              </Link>

              {/* Admin */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#111827] hover:bg-[#f3f4f6] transition-colors"
                >
                  <FiShield size={18} />

                  <span>Admin</span>
                </Link>
              )}

              {/* Login / Logout */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm text-[#111827] hover:bg-[#f3f4f6] transition-colors border-t border-[#d1d5db]"
                >
                  <FiLogOut size={18} />

                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/login?redirect=/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#111827] hover:bg-[#f3f4f6] transition-colors border-t border-[#d1d5db]"
                >
                  <FiLogIn size={18} />

                  <span>Login</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
