"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function HomeClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState<
    "featured" | "price-asc" | "price-desc" | "rating"
  >("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filtered = products
    .filter(
      (p) => selectedCategory === "All" || p.category === selectedCategory,
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/getProducts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);
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
      <div className="relative overflow-hidden mx-4 mt-4 rounded-2xl border border-[#1c1c1c]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[#888] text-[10px] tracking-[0.3em] uppercase font-medium mb-1">
            SS 2026 Collection
          </p>
          <h1 className="text-white font-['Fraunces'] text-3xl leading-tight">
            See the world
            <br />
            <em className="not-italic text-[#aaa]">in focus.</em>
          </h1>
          <p className="text-[#666] text-xs mt-1.5">
            Premium optical & sunwear
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-5 px-4">
        <p className="text-[#555] text-[10px] tracking-[0.3em] uppercase font-medium mb-3">
          Shop by Category
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 tracking-wide ${
                selectedCategory === cat
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#777] border-[#2a2a2a] hover:border-[#444] hover:text-[#bbb]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Row */}
      <div className="mt-5 px-4 flex items-center justify-between">
        <p className="text-[#888] text-xs">
          <span className="text-white font-semibold">{filtered.length}</span>{" "}
          items
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[#555] text-[10px] tracking-wide uppercase">
            Sort
          </span>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#111] border border-[#222] text-[#aaa] text-xs rounded-lg px-3 py-2 hover:border-[#444] transition-colors"
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
              <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-[#2a2a2a] bg-[#111] shadow-2xl overflow-hidden">
                {[
                  // { value: "featured", label: "Featured" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  // { value: "rating", label: "Top Rated" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSort(option.value as typeof sort);
                      setSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs text-left transition-colors ${
                      sort === option.value
                        ? "bg-[#1c1c1c] text-white"
                        : "text-[#777] hover:bg-[#181818] hover:text-[#bbb]"
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
      {/* Product Grid / Loader */}
      {/* Product Grid / Loader */}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4 mt-4 pb-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4">
          <p className="text-[#444] text-lg font-['Fraunces']">
            No items in this category
          </p>

          <p className="text-[#333] text-sm mt-1">
            Try selecting a different category
          </p>
        </div>
      )}

      {/* Product Grid */}
      {/* <div className="grid grid-cols-2 gap-3 px-4 mt-4 pb-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 px-4">
          <p className="text-[#444] text-lg font-['Fraunces']">No items in this category</p>
          <p className="text-[#333] text-sm mt-1">Try selecting a different category</p>
        </div>
      )} */}
    </div>
  );
}
