"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/slics/wishlist";
import { addToCart } from "@/store/slics/cart";
import type { RootState } from "@/store/store";
import type { Product } from "@/types";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[#d1d5db] flex items-center justify-center mb-5">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4b5563"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h2 className="text-[#111827] font-medium text-xl mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-[#374151] text-sm leading-relaxed">
          Save items you love by tapping the heart icon on any product.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-5">
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-[#111827] font-medium text-2xl">Wishlist</h1>
        <span className="text-[#374151] text-sm">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-3">
        {wishlist.map((product: Product) => (
          <div
            key={product.id}
            className="flex gap-3 bg-[#ffffff] rounded-2xl overflow-hidden border border-[#e5e7eb] p-3 hover:border-[#d1d5db] transition-all shadow-sm"
          >
            <Link href={`/product/${product.id}`} className="shrink-0">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#f3f4f6]">
                <Image
                  src={product.variants[0].image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${product.id}`}
                className="text-left w-full block"
              >
                <p className="text-[#374151] text-[10px] tracking-widest uppercase">
                  {product.brand}
                </p>
                <p className="text-[#111827] font-medium text-base leading-tight truncate">
                  {product.name}
                </p>
                <p className="text-[#374151] text-xs mt-0.5">{product.category}</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-[#111827] font-semibold">
                    PKR {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[#4b5563] text-xs line-through">
                      PKR {product.originalPrice}
                    </span>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() =>
                    dispatch(addToCart({ product, color: "Matte Black" }))
                  }
                  className="flex-1 py-2 bg-[#111827] text-white text-xs font-semibold rounded-xl hover:bg-[#374151] active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="p-2 border border-[#d1d5db] rounded-xl hover:border-[#9ca3af] transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 mb-4">
        <button
          onClick={() => {
            wishlist.forEach((p) =>
              dispatch(addToCart({ product: p, color: p.variants[0].color })),
            );
          }}
          className="w-full py-4 border border-[#d1d5db] text-[#4b5563] text-sm font-medium rounded-2xl hover:border-[#9ca3af] hover:text-[#111827] transition-all"
        >
          Add All to Cart
        </button>
      </div>
    </div>
  );
}
