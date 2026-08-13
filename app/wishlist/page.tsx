'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '@/store/slics/wishlist';
import { addToCart } from '@/store/slics/cart';
import type { RootState } from '@/store/store';
import type { Product } from '@/types';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[#222] flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h2 className="text-white font-['Fraunces'] text-xl mb-2">Your wishlist is empty</h2>
        <p className="text-[#555] text-sm leading-relaxed">
          Save items you love by tapping the heart icon on any product.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-5">
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-white font-['Fraunces'] text-2xl">Wishlist</h1>
        <span className="text-[#555] text-sm">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="space-y-3">
        {wishlist.map((product: Product) => (
          <div
            key={product.id}
            className="flex gap-3 bg-[#111111] rounded-2xl overflow-hidden border border-[#1c1c1c] p-3 hover:border-[#2a2a2a] transition-all"
          >
            <Link href={`/product/${product.id}`} className="shrink-0">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#0e0e0e]">
                <Image src={product.variants[0].image} alt={product.name} fill sizes="80px" className="object-cover" />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/product/${product.id}`} className="text-left w-full block">
                <p className="text-[#555] text-[10px] tracking-widest uppercase">{product.brand}</p>
                <p className="text-white font-['Fraunces'] text-base leading-tight truncate">{product.name}</p>
                <p className="text-[#666] text-xs mt-0.5">{product.category}</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-white font-semibold">PKR {product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[#444] text-xs line-through">PKR {product.originalPrice}</span>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => dispatch(addToCart({ product, color: 'Matte Black' }))}
                  className="flex-1 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-[#e0e0e0] active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="p-2 border border-[#222] rounded-xl hover:border-[#444] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            wishlist.forEach((p) => dispatch(addToCart({ product: p, color: 'Matte Black' })));
          }}
          className="w-full py-4 border border-[#2a2a2a] text-[#888] text-sm font-medium rounded-2xl hover:border-[#444] hover:text-white transition-all"
        >
          Add All to Cart
        </button>
      </div>
    </div>
  );
}
