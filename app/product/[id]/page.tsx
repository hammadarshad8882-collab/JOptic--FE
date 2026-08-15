"use client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ProductDetail from "@/components/ProductDetail";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const trackedProductId = useRef<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/getProductbyId/${id}`,
        );
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);
  useEffect(() => {
  if (!product) return;

  if (trackedProductId.current === product.id) return;

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_type: "product",
      content_name: product.name,
      value: Number(product.price),
      currency: "PKR",
    });

    trackedProductId.current = product.id;
  }
}, [product]);
  if (isLoading) {
    return (
      <div className="mx-auto flex h-full items-center justify-center min-h-screen px-6 text-center">
        <div className="w-8 h-8 border-2 border-[#cbd5e1] border-t-[#111827] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-lg mx-auto flex items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-[#374151] text-sm">Product not found</p>
      </div>
    );
  }

  return <ProductDetail product={product} relatedProducts={[]} />;
}
