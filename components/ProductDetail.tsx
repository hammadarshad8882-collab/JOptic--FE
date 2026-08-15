"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slics/cart";
import { toggleWishlist } from "@/store/slics/wishlist";
import type { RootState } from "@/store/store";

export default function ProductDetail({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const inWishlist = wishlist.some((item) => item.id === product.id);
  const inCart = cartItems.some((item) => item.product.id === product.id);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "reviews">(
    "specs",
  );
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color || "",
  );
  const selectedVariant = product.variants?.find(
    (variant: any) => variant.color === selectedColor,
  );

  const variantImages = selectedVariant?.images || [];
  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);
 const handleAddToCart = () => {
  if (!selectedVariant) return;

  dispatch(
    addToCart({
      product,
      color: selectedVariant.color,
    }),
  );

  // Meta Pixel - AddToCart
  if (
    typeof window !== "undefined" &&
    typeof window.fbq === "function"
  ) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_type: "product",
      content_name: product.name,
      value: Number(product.price),
      currency: "PKR",
    });
  }

  setAdded(true);

  setTimeout(() => setAdded(false), 2000);
};

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Back Button */}
      <div className="px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#374151] hover:text-[#111827] transition-colors text-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-[#f3f4f6] aspect-square">
        <Image
          src={
            variantImages[activeImage] ||
            selectedVariant?.image ||
            product.image
          }
          alt={`${product.name} - ${selectedColor}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 512px"
          className="object-cover"
        />
        {/* Wishlist */}
        <button
          onClick={() => dispatch(toggleWishlist(product))}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-[#f8f9fa]/90 backdrop-blur-sm hover:bg-[#f3f4f6] transition-colors"
        >
          <svg
            width="20"
            height="20"
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

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-[#111827] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#f3f4f6] border border-[#cbd5e1] text-[#111827] text-[9px] font-medium px-2 py-0.5 rounded-full tracking-widest uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Image Dots */}
        {variantImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {variantImages.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  activeImage === i ? "bg-[#111827] w-4 h-1.5" : "bg-[#6b7280] h-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {variantImages.length > 1 && (
        <div className="flex gap-2 px-4 mt-3">
          {variantImages.map((img: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === i ? "border-[#111827]" : "border-[#d1d5db] opacity-50"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="px-4 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#374151] text-[10px] tracking-[0.3em] uppercase font-medium">
              {product.brand}
            </p>
            <h1 className="text-[#111827] font-medium text-2xl leading-tight mt-0.5">
              {product.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[#111827] text-2xl font-semibold">
              PKR {product.price}
            </p>
            {product.originalPrice && (
              <p className="text-[#4b5563] text-sm line-through">
                PKR {product.originalPrice}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {stars.map((s) => (
              <svg
                key={s}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill={s <= Math.round(product.rating) ? "#111827" : "#d1d5db"}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-[#111827] text-sm font-medium">
            {product.rating}
          </span>
          <span className="text-[#374151] text-xs">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Color Selection */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#374151] text-xs font-medium tracking-wide uppercase">
              Frame Color
            </p>
            <p className="text-[#111827] text-xs">{selectedColor}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.variants?.map((variant: any) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedColor(variant.color);
                  setActiveImage(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  selectedColor === variant.color
                    ? "border-[#111827] text-[#111827] bg-[#f3f4f6]"
                    : "border-[#d1d5db] text-[#374151] hover:border-[#9ca3af]"
                }`}
              >
                {variant.color}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 ${
              inCart
                ? "bg-[#f3f4f6] border border-[#cbd5e1] text-[#4b5563]"
                : "bg-[#111827] text-white hover:bg-[#374151] active:scale-95"
            }`}
          >
            {inCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
          <button
            onClick={() => dispatch(toggleWishlist(product))}
            className={`p-4 rounded-2xl border transition-all ${
              inWishlist
                ? "border-[#111827] bg-[#f3f4f6] text-[#111827]"
                : "border-[#d1d5db] text-[#374151] hover:border-[#9ca3af]"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={inWishlist ? "white" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-7">
          <div className="flex border-b border-[#e5e7eb]">
            {(["specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-2.5 text-xs font-medium tracking-wide uppercase transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#111827] text-[#111827]"
                    : "border-transparent text-[#4b5563] hover:text-[#111827]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === "details" && (
              <div>
                {/* <p className="text-[#374151] text-sm leading-relaxed">{product.description}</p>
                <ul className="mt-4 space-y-2">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-[#888]">
                      <span className="w-4 h-4 rounded-full border border-[#333] flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul> */}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-0">
                {[
                  ["Frame Shape", product.frameShape],
                  ["Frame Material", product.frameMaterial],
                  ["Lens Thickness", product.lensWidth],
                  ["Bridge Width", product.bridgeWidth],
                  ["Temple Length", product.templeLength],
                  ["Category", product.category],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3 border-b border-[#f3f4f6]"
                  >
                    <span className="text-[#374151] text-xs uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-[#374151] text-sm">{`${value}`}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-center">
                    <p className="text-[#111827] text-4xl font-['Fraunces']">
                      {product.rating}
                    </p>
                    <div className="flex justify-center mt-1">
                      {stars.map((s) => (
                        <svg
                          key={s}
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill={
                            s <= Math.round(product.rating)
                              ? "white"
                              : "#d1d5db"
                          }
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#374151] text-[10px] mt-1">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        star === 5
                          ? 70
                          : star === 4
                            ? 20
                            : star === 3
                              ? 7
                              : star === 2
                                ? 2
                                : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-[#374151] text-[10px] w-2">
                            {star}
                          </span>
                          <div className="flex-1 h-1 bg-[#e5e7eb] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#111827] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sample Reviews */}
                {[
                  {
                    name: "Marcus T.",
                    date: "Jul 2026",
                    text: "Incredible build quality. The titanium feels solid yet lightweight.",
                    rating: 5,
                  },
                  {
                    name: "Priya S.",
                    date: "Jun 2026",
                    text: "Exactly as described. Polarization is excellent.",
                    rating: 5,
                  },
                  {
                    name: "James H.",
                    date: "Jun 2026",
                    text: "Great frames, delivery was fast. Would buy again.",
                    rating: 4,
                  },
                ].map((review) => (
                  <div
                    key={review.name}
                    className="py-4 border-b border-[#f3f4f6]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[#111827] text-sm font-medium">
                        {review.name}
                      </p>
                      <p className="text-[#4b5563] text-[10px]">{review.date}</p>
                    </div>
                    <div className="flex mt-1">
                      {stars.map((s) => (
                        <svg
                          key={s}
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill={s <= review.rating ? "#111827" : "#d1d5db"}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#4b5563] text-sm mt-1.5 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <p className="text-[#374151] text-[10px] tracking-[0.3em] uppercase font-medium mb-4">
              You Might Also Like
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="shrink-0 w-36 bg-[#ffffff] rounded-xl overflow-hidden border border-[#e5e7eb] hover:border-[#cbd5e1] transition-all text-left block shadow-sm"
                >
                  <div className="relative aspect-square bg-[#f3f4f6]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[#111827] font-medium text-sm leading-tight truncate">
                      {p.name}
                    </p>
                    <p className="text-[#4b5563] text-xs mt-1">${p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
