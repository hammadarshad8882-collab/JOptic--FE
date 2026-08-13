'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '@/store/slics/wishlist';
import type { RootState } from '@/store/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const inWishlist = wishlist.some((item) => item.id === product.id);

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };
  return (
    <div className="group relative bg-[#111111] rounded-2xl overflow-hidden border border-[#1c1c1c] hover:border-[#333] transition-all duration-300">
      <button
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[#080808]/70 backdrop-blur-sm hover:bg-[#1a1a1a] transition-colors"
        onClick={(e) => { e.preventDefault(); handleWishlist();}}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={inWishlist ? 'white' : 'none'}
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {(product.isNew || product.isBestseller || product.discount) && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase">
              New
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-[#1a1a1a] border border-[#333] text-white text-[9px] font-medium px-2 py-0.5 rounded-full tracking-widest uppercase">
              Best
            </span>
          )}
          {product.discount && (
            <span className="bg-[#1a1a1a] border border-[#333] text-[#aaa] text-[9px] font-medium px-2 py-0.5 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      )}

      <Link href={`/product/${product.id}`} className="block w-full text-left">
        <div className="aspect-square bg-[#0e0e0e] overflow-hidden relative">
          <Image
            src={product.variants[0].image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-3">
          <p className="text-[#555] text-[10px] tracking-widest uppercase font-medium">{product.brand}</p>
          <h3 className="text-white font-['Fraunces'] text-base leading-tight mt-0.5">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="10" height="10" viewBox="0 0 24 24" fill={star <= Math.round(product.rating) ? 'white' : '#333'} className="shrink-0">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-[#666] text-[10px]">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-white font-semibold text-base">PKR {product.price}</span>
            {product.originalPrice && (
              <span className="text-[#444] text-xs line-through">PKR {product.originalPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
