"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeFromCart } from "@/store/slics/cart";
import type { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;
  const user = useSelector((state: RootState) => state.auth.user);

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[#222] flex items-center justify-center mb-5">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#444"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h2 className="text-white font-['Fraunces'] text-xl mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#555] text-sm leading-relaxed mb-6">
          Browse our collection and add a pair you love.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-2xl hover:bg-[#e0e0e0] transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-white font-['Fraunces'] text-2xl">Cart</h1>
        <span className="text-[#555] text-sm">
          {cart.reduce((s, i) => s + i.quantity, 0)}{" "}
          {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Free shipping banner */}
      {/* {subtotal < 200 && (
        <div className="bg-[#0e0e0e] border border-[#1c1c1c] rounded-xl p-3 mb-4 flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <p className="text-[#777] text-xs">
            Add <span className="text-white font-medium">${(200 - subtotal).toFixed(0)}</span> more for free shipping
          </p>
          <div className="ml-auto h-1 w-16 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(subtotal / 200) * 100}%` }} />
          </div>
        </div>
      )} */}

      {/* Cart Items */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={`${item.product.id}-${item.selectedColor}`}
            className="flex gap-3 bg-[#111111] rounded-2xl border border-[#1c1c1c] p-3"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#0e0e0e] shrink-0">
              <Image
                src={
                  item.product.variants.find(
                    (v: any) => v.color === item.selectedColor,
                  )?.image || item.product.variants[0].image
                }
                alt={item.product.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#555] text-[9px] tracking-widest uppercase">
                    {item.product.brand}
                  </p>
                  <p className="text-white font-['Fraunces'] text-sm leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-[#555] text-[10px] mt-0.5">
                    {item.selectedColor}
                  </p>
                </div>
                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        productId: item.product.id,
                        color: item.selectedColor,
                      }),
                    )
                  }
                  className="p-1 text-[#444] hover:text-[#888] transition-colors ml-2 shrink-0"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-2 border border-[#222] rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product.id,
                          color: item.selectedColor,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="text-white text-sm w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product.id,
                          color: item.selectedColor,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-white font-semibold text-sm">
                  PKR {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-5 bg-[#111111] rounded-2xl border border-[#1c1c1c] p-4">
        <p className="text-[#555] text-[10px] tracking-[0.3em] uppercase font-medium mb-4">
          Order Summary
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#777]">Subtotal</span>
            <span className="text-white">PKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#777]">Shipping</span>
            <span className="text-white">
              {shipping === 0 ? "Free" : `PKR${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="border-t border-[#1c1c1c] pt-2.5 flex justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-white font-semibold text-lg">
              PKR {total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-4 py-4 bg-white text-black font-semibold text-sm rounded-2xl hover:bg-[#e0e0e0] active:scale-95 transition-all"
        >
          Checkout
        </button>
        <Link
          href="/"
          className="w-full mt-2.5 py-3 border border-[#222] text-[#666] text-sm rounded-2xl hover:border-[#333] hover:text-[#aaa] transition-all block text-center"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { icon: "🔒", label: "Secure Pay" },
          { icon: "↩", label: "30-Day Returns" },
          { icon: "✦", label: "Authentic" },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center gap-1 py-3 bg-[#0e0e0e] rounded-xl border border-[#1a1a1a]"
          >
            <span className="text-lg">{badge.icon}</span>
            <span className="text-[#555] text-[10px] tracking-wide">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
