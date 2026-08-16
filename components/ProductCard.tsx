"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/store/slics/wishlist";
import { addToCart } from "@/store/slics/cart";
import type { RootState } from "@/store/store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const inWishlist = wishlist.some((item) => item.id === product.id);
  const inCart = cartItems.some((item) => item.product.id === product.id);

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      return;
    }
    dispatch(
      addToCart({
        product,
        color: product.variants?.[0]?.color || "Matte Black",
      }),
    );

    // Meta Pixel - AddToCart
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "AddToCart", {
        content_ids: [product.id],
        content_type: "product",
        content_name: product.name,
        value: Number(product.price),
        currency: "PKR",
      });
    }
  };
  return (
    <div className="group relative bg-[#ffffff] rounded-2xl overflow-hidden border border-[#e5e7eb] hover:border-[#cbd5e1] transition-all duration-300 shadow-sm">
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Wishlist */}
        <button
          className="p-1.5 rounded-full bg-[#f8f9fa]/90 backdrop-blur-sm border border-[#d1d5db] hover:border-[#111827] hover:bg-[#f3f4f6] transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            handleWishlist();
          }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={inWishlist ? "#111827" : "none"}
            stroke="#111827"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Cart */}
        <button
          disabled={product.stock === 0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart(e);
          }}
          className={`p-1.5 rounded-full bg-[#f8f9fa]/90 backdrop-blur-sm border border-[#d1d5db]  transition-all duration-200 ${
            product.stock === 0
              ? "opacity-50 cursor-not-allowed"
              : inCart
                ? " bg-[#111827] text-white"
                : "text-[#374151] hover:border-[#111827] hover:bg-[#f3f4f6] hover:text-[#111827]"
          }`}
          title={inCart ? "Added to Cart" : "Add to Cart"}
          aria-label={inCart ? "Added to cart" : "Add to cart"}
        >
          {inCart ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          )}
        </button>
      </div>

      {(product.isNew || product.isBestseller || product.discount) && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-[#111827] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase">
              New
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-[#f3f4f6] border border-[#cbd5e1] text-[#111827] text-[9px] font-medium px-2 py-0.5 rounded-full tracking-widest uppercase">
              Best
            </span>
          )}
          {product.discount && (
            <span className="bg-[#f3f4f6] border border-[#cbd5e1] text-[#374151] text-[9px] font-medium px-2 py-0.5 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      )}

      <Link href={`/product/${product.id}`} className="block w-full text-left">
        <div className="aspect-square bg-[#f3f4f6] overflow-hidden relative">
          <Image
            src={product.variants[0].image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-3">
          <p className="text-[#374151] text-[10px] tracking-widest uppercase font-medium">
            {product.brand}
          </p>
          <h3 className="text-[#111827] font-medium text-base leading-tight mt-0.5">
            {product.name}
          </h3>
          {/* <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(product.rating) ? "#111827" : "#cbd5e1"}
                  className="shrink-0"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-[#374151] text-[10px]">
              ({product.reviewCount})
            </span>
          </div> */}

          <div className="flex items-center gap-2 py-1">
            {product.stock === 0 ? (
              <span className="text-red-500 text-[10px] font-semibold uppercase">
                Out of Stock
              </span>
            ) : (
              <span className="text-green-600 text-[10px] font-semibold uppercase">
                In Stock
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[#111827] font-semibold text-base">
                PKR {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[#4b5563] text-xs line-through">
                  PKR {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
