"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Loader from "./loader";

export default function HomeClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState<
    "featured" | "price-asc" | "price-desc" | "rating"
  >("featured");
  const [products] = useState<Product[]>(initialProducts);
  const [productSearch, setProductSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => {
    const search = productSearch.trim().toLowerCase();

    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "All" || p.category === selectedCategory;

        const matchesSearch =
          search === "" ||
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, productSearch, sort]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden mx-4 mt-4 rounded-2xl border border-[#e5e7eb]">
        <div className="relative w-full h-52">
          <Image
            src="https://images.unsplash.com/photo-1477814670986-8d8dccc5640d?w=800&h=500&fit=crop&auto=format"
            alt="Eyewear collection"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover object-top opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* <p className="text-[#888] text-[10px] tracking-[0.3em] uppercase font-medium mb-1">
            SS 2026 Collection
          </p> */}
          <h1 className="text-[#111827] font-medium text-3xl leading-tight font-[600]">
            See the world
            <br />
            <em className="not-italic text-[#aaa]">in focus.</em>
          </h1>
          <p className="text-[#666] text-xs mt-1.5">
            Premium optical & sunwear
          </p>
        </div>
      </div>
      <div className="relative mb-4 px-4 mt-5">
        <svg
          className="absolute left-7 top-1/2 -translate-y-1/2 text-[#4b5563]"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-[#ffffff] border border-[#e5e7eb] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#111827] placeholder-[#6b7280] outline-none focus:border-[#9ca3af]"
        />
      </div>
      {/* Category Pills */}
      <div className="mt-5 px-4">
        <p className="text-[#374151] text-[10px] tracking-[0.3em] uppercase font-medium mb-3">
          Shop by Category
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 tracking-wide ${
                selectedCategory === cat
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-transparent text-[#4b5563] border-[#d1d5db] hover:border-[#9ca3af] hover:text-[#111827]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Row */}
      <div className="mt-5 px-4 flex items-center justify-between">
        <p className="text-[#4b5563] text-xs">
          <span className="text-[#111827] font-semibold">
            {filtered.length}
          </span>{" "}
          items
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[#374151] text-[10px] tracking-wide uppercase">
            Sort
          </span>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#ffffff] border border-[#d1d5db] text-[#374151] text-xs rounded-lg px-3 py-2 hover:border-[#9ca3af] transition-colors"
            >
              <span>
                {sort === "featured"
                  ? "Featured"
                  : sort === "price-asc"
                    ? "Price: Low to High"
                    : sort === "price-desc"
                      ? "Price: High to Low"
                      : "Top Rated"}
              </span>

              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-200 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-[#d1d5db] bg-[#ffffff] shadow-2xl overflow-hidden">
                {[
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSort(option.value as typeof sort);
                      setSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs text-left transition-colors ${
                      sort === option.value
                        ? "bg-[#f3f4f6] text-[#111827]"
                        : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]"
                    }`}
                  >
                    <span>{option.label}</span>

                    {sort === option.value && (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4 mt-4 pb-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4">
          <p className="text-[#4b5563] text-lg font-['Fraunces']">
            No items in this category
          </p>

          <p className="text-[#374151] text-sm mt-1">
            Try selecting a different category
          </p>
        </div>
      )}
    </div>
  );
}
