'use client';

import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { clearUser } from '@/store/slics/auth';
import { clearCart } from '@/store/slics/cart';
import { clearWishlist } from '@/store/slics/wishlist';
import { clearOrders, setInitialOrders } from '@/store/slics/orders';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const orders = useSelector((state: RootState) => state.orders.items);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const ordersCount = orders.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/getOrderbyUserId/${user.id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(setInitialOrders(data.orders || []));
        }
      } catch (error) {
        console.error('Failed to fetch navbar orders:', error);
      }
    };
    fetchMyOrders();
  }, [user, dispatch]);
 const handleLogout = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.clear();
      dispatch(clearUser());
      localStorage.removeItem('lensco:cart');
      localStorage.removeItem('lensco:wishlist');
      localStorage.removeItem('lensco:orders');
      localStorage.removeItem('lensco:auth');
      dispatch(clearCart());
      dispatch(clearWishlist());
      dispatch(clearOrders());
      setMenuOpen(false);
      router.push('/');
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-[#1c1c1c]">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-['Fraunces'] text-xl font-semibold tracking-tight leading-none"
        >
          J<span className="text-[#888]">Optics</span>
        </Link>

        <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative p-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
              aria-label="Menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>

            {/* MENU POPUP */}
            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-44 rounded-lg border border-[#2a2a2a] bg-[#111] shadow-lg">

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>Wishlist</span>

                  {wishlistCount > 0 && (
                    <span className="bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>Cart</span>

                  {cartCount > 0 && (
                    <span className="bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/order"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>My Orders</span>

                  {ordersCount > 0 && (
                    <span className="bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {ordersCount}
                    </span>
                  )}
                </Link>


                {/* Admin */}
               {user?.role === 'ADMIN' && (
  <Link
    href="/admin"
    onClick={() => setMenuOpen(false)}
    className="block px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors"
  >
    Admin
  </Link>
)}

                {/* Logout */}
            {user ? (
  <button
    onClick={handleLogout}
    className="w-full text-left px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors border-t border-[#2a2a2a]"
  >
    Logout
  </button>
) : (
  <Link
    href="/login?redirect=/"
    onClick={() => setMenuOpen(false)}
    className="block px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors border-t border-[#2a2a2a]"
  >
    Login
  </Link>
)}
              </div>
            )}
          </div>
      </div>
    </header>
  );
}
