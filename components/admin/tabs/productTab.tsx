import type { Product } from "@/types";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/api/fetchWithAuth";

interface ProductTabProps {
  setTab: (tab: any) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function ProductTab({
  setTab,
  onDeleteProduct,
}: ProductTabProps) {
  const [productSearch, setProductSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newVariantImages, setNewVariantImages] = useState<
    Record<number, File[]>
  >({});
  const [isloading, setIsloading] = useState<boolean>(false);
  const [newImages, setNewImages] = useState<File[]>([]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()),
  );

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsloading(true);
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/getProducts`,
          {
            method: "GET",
          },
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          setIsloading(false);
        }
      } catch (error) {
        console.log(error);
        setIsloading(false);
      } finally {
        setIsloading(false);
      }
    };
    getProducts();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/deleteProduct/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (productToUpdate: Product) => {
    try {
      const formData = new FormData();

      // ==========================================
      // Product fields
      // ==========================================

      formData.append("name", productToUpdate.name);
      formData.append("category", productToUpdate.category);
      formData.append("price", String(productToUpdate.price));

      if (
        productToUpdate.originalPrice !== null &&
        productToUpdate.originalPrice !== undefined
      ) {
        formData.append("originalPrice", String(productToUpdate.originalPrice));
      }

      formData.append("description", productToUpdate.description);

      formData.append("frameShape", productToUpdate.frameShape || "");

      formData.append("frameMaterial", productToUpdate.frameMaterial || "");

      formData.append("lensWidth", productToUpdate.lensWidth || "");

      formData.append("bridgeWidth", productToUpdate.bridgeWidth || "");

      formData.append("templeLength", productToUpdate.templeLength || "");

      formData.append("isNew", String(productToUpdate.isNew));

      formData.append("isBestseller", String(productToUpdate.isBestseller));

      // ==========================================
      // Variants
      // ==========================================

      const variants = productToUpdate.variants || [];

      // Send existing variant information
      formData.append(
        "variants",
        JSON.stringify(
          variants.map((variant: any) => ({
            id: variant.id,
            color: variant.color,
            stock: Number(variant.stock),

            // Existing images that were NOT deleted
            images: variant.images || [],
          })),
        ),
      );

      // ==========================================
      // New images for each variant
      // ==========================================

      variants.forEach((variant: any, variantIndex: number) => {
        const files = newVariantImages[variantIndex] || [];

        files.forEach((file: any) => {
          formData.append(`variantImages_${variantIndex}`, file);
        });
      });

      // ==========================================
      // Send request
      // ==========================================

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/updateProduct/${productToUpdate.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await response.json();

      console.log("Update response:", data);

      if (data.success) {
        const updatedProd = data.product || productToUpdate;

        setProducts(
          products.map((p) => (p.id === productToUpdate.id ? updatedProd : p)),
        );

        setEditingProduct(null);

        setNewVariantImages({});

        console.log("Product updated successfully");
      } else {
        console.log("Failed to update product:", data.message);
      }
    } catch (error) {
      console.error("Update product error:", error);
    }
  };
  if (isloading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#333] border-t-white rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-white font-['Fraunces'] text-2xl">Products</h2>
          <p className="text-[#444] text-xs mt-0.5">
            {products.length} items in catalogue
          </p>
        </div>
        <button
          onClick={() => setTab("add")}
          className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#e0e0e0] transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New
        </button>
      </div>

      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]"
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
          className="w-full bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#333] outline-none focus:border-[#333]"
        />
      </div>

      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all"
          >
            <button
              className="w-full p-4 text-left flex items-center justify-between"
              onClick={() =>
                setExpandedProduct(
                  expandedProduct === product.id ? null : product.id,
                )
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#111] shrink-0">
                  <img
                    src={product.variants[0].image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* <span className="text-[#444] text-[10px]">{product.brand}</span> */}
                    <span className="text-[#2a2a2a]">·</span>
                    <span className="text-[#444] text-[10px]">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">
                    PKR{product.price}
                  </p>
                  {product.isNew && (
                    <span className="text-[#81c784] text-[9px] tracking-wide uppercase">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="ml-1 text-[#f0b429] text-[9px] tracking-wide uppercase">
                      Best
                    </span>
                  )}
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expandedProduct === product.id ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {expandedProduct === product.id && (
              <div className="border-t border-[#1a1a1a] p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Original Price",
                      value: product.originalPrice
                        ? `PKR${product.originalPrice}`
                        : "-",
                    },

                    { label: "Frame Shape", value: product.frameShape || "-" },
                    { label: "Material", value: product.frameMaterial || "-" },
                    { label: "Lens Width", value: product.lensWidth || "-" },
                    {
                      label: "Bridge Width",
                      value: product.bridgeWidth || "-",
                    },
                    {
                      label: "Temple Length",
                      value: product.templeLength || "-",
                    },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-[#333] text-[10px] uppercase tracking-wide">
                        {f.label}
                      </p>
                      <p className="text-[#aaa] text-xs mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[#333] text-[10px] uppercase tracking-wide mb-1">
                    Description
                  </p>
                  <p className="text-[#aaa] text-xs leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex pt-3 mt-1 border-t border-[#1a1a1a] justify-end gap-3">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="py-2.5 px-4 border border-[#1a1a1a] text-white text-xs font-medium rounded-xl hover:bg-[#1a1a1a] transition-all flex items-center gap-1.5"
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
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Update Product
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="py-2.5 px-4 border border-[#2a0000] text-[#ef9a9a] text-xs font-medium rounded-xl hover:bg-[#2a0000]/40 transition-all flex items-center gap-1.5"
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
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Delete Product
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirm popover */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-['Fraunces'] text-lg mb-1">
              Delete product?
            </p>
            <p className="text-[#555] text-sm mb-5">
              This will remove it from the catalogue. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-[#222] text-[#666] text-sm rounded-xl hover:border-[#333]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="flex-1 py-3 bg-[#ef9a9a]/10 border border-[#ef9a9a]/30 text-[#ef9a9a] text-sm font-medium rounded-xl hover:bg-[#ef9a9a]/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setEditingProduct(null);
            setNewVariantImages({});
          }}
        >
          <div
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-medium">Edit Product</h2>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setNewVariantImages({});
                }}
                className="text-[#666] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingProduct);
              }}
              className="space-y-6"
            >
              {/* ===================================== */}
              {/* BASIC PRODUCT INFORMATION             */}
              {/* ===================================== */}

              <div>
                <h3 className="text-white text-sm font-medium mb-4">
                  Product Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Name
                    </label>

                    <input
                      type="text"
                      value={editingProduct.name || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Category
                    </label>

                    <input
                      type="text"
                      value={editingProduct.category || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Price
                    </label>

                    <input
                      type="number"
                      value={editingProduct.price ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Original Price
                    </label>

                    <input
                      type="number"
                      value={editingProduct.originalPrice ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Frame Shape */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Frame Shape
                    </label>

                    <input
                      type="text"
                      value={editingProduct.frameShape || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          frameShape: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Frame Material */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Frame Material
                    </label>

                    <input
                      type="text"
                      value={editingProduct.frameMaterial || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          frameMaterial: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Lens Width */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Lens Width
                    </label>

                    <input
                      type="text"
                      value={editingProduct.lensWidth || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          lensWidth: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Bridge Width */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Bridge Width
                    </label>

                    <input
                      type="text"
                      value={editingProduct.bridgeWidth || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          bridgeWidth: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Temple Length */}
                  <div>
                    <label className="block text-[#888] text-xs mb-1.5">
                      Temple Length
                    </label>

                    <input
                      type="text"
                      value={editingProduct.templeLength || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          templeLength: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-[#888] text-xs mb-1.5">
                      Description
                    </label>

                    <textarea
                      value={editingProduct.description || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444] min-h-[100px]"
                    />
                  </div>

                  {/* New */}
                  <label className="flex items-center gap-2 text-sm text-[#aaa]">
                    <input
                      type="checkbox"
                      checked={!!editingProduct.isNew}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isNew: e.target.checked,
                        })
                      }
                    />
                    New Product
                  </label>

                  {/* Bestseller */}
                  <label className="flex items-center gap-2 text-sm text-[#aaa]">
                    <input
                      type="checkbox"
                      checked={!!editingProduct.isBestseller}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isBestseller: e.target.checked,
                        })
                      }
                    />
                    Bestseller
                  </label>
                </div>
              </div>

              {/* ===================================== */}
              {/* VARIANTS                               */}
              {/* ===================================== */}

              <div className="border-t border-[#222] pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white text-sm font-medium">
                      Frame Colors
                    </h3>

                    <p className="text-[#666] text-xs mt-1">
                      Manage stock and images for each color.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        ...editingProduct,
                        variants: [
                          ...(editingProduct.variants || []),
                          {
                            id: `new-${Date.now()}`,
                            color: "",
                            stock: 0,
                            image: "",
                            images: [],
                          },
                        ],
                      });
                    }}
                    className="px-3 py-2 bg-white text-black rounded-lg text-xs font-medium hover:bg-[#ddd]"
                  >
                    + Add Color
                  </button>
                </div>

                <div className="space-y-5">
                  {(editingProduct.variants || []).map(
                    (variant: any, variantIndex: number) => {
                      const newFiles = newVariantImages[variantIndex] || [];

                      return (
                        <div
                          key={variant.id || variantIndex}
                          className="border border-[#252525] bg-[#0d0d0d] rounded-xl p-4"
                        >
                          {/* Variant Header */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[#888] text-xs">
                              Color {variantIndex + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                const updatedVariants =
                                  editingProduct.variants.filter(
                                    (_: any, i: number) => i !== variantIndex,
                                  );

                                setEditingProduct({
                                  ...editingProduct,
                                  variants: updatedVariants,
                                });

                                const updatedFiles = {
                                  ...newVariantImages,
                                };

                                delete updatedFiles[variantIndex];

                                setNewVariantImages(updatedFiles);
                              }}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Color + Stock */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Color */}
                            <div>
                              <label className="block text-[#888] text-xs mb-1.5">
                                Frame Color
                              </label>

                              <input
                                type="text"
                                value={variant.color || ""}
                                onChange={(e) => {
                                  const updatedVariants = [
                                    ...editingProduct.variants,
                                  ];

                                  updatedVariants[variantIndex] = {
                                    ...updatedVariants[variantIndex],
                                    color: e.target.value,
                                  };

                                  setEditingProduct({
                                    ...editingProduct,
                                    variants: updatedVariants,
                                  });
                                }}
                                className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                                placeholder="e.g. Red"
                              />
                            </div>

                            {/* Stock */}
                            <div>
                              <label className="block text-[#888] text-xs mb-1.5">
                                Stock
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={variant.stock ?? 0}
                                onChange={(e) => {
                                  const updatedVariants = [
                                    ...editingProduct.variants,
                                  ];

                                  updatedVariants[variantIndex] = {
                                    ...updatedVariants[variantIndex],
                                    stock: Number(e.target.value),
                                  };

                                  setEditingProduct({
                                    ...editingProduct,
                                    variants: updatedVariants,
                                  });
                                }}
                                className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                              />
                            </div>
                          </div>

                          {/* Existing Images */}
                          <div className="mb-4">
                            <label className="block text-[#888] text-xs mb-2">
                              Current Images
                            </label>

                            <div className="flex flex-wrap gap-3">
                              {(variant.images || []).map(
                                (img: string, imageIndex: number) => (
                                  <div
                                    key={`${variant.id}-${imageIndex}`}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#111] border border-[#222] group"
                                  >
                                    <img
                                      src={img}
                                      alt={`${variant.color} ${imageIndex + 1}`}
                                      className="w-full h-full object-cover"
                                    />

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedVariants = [
                                          ...editingProduct.variants,
                                        ];

                                        const updatedImages = [
                                          ...(updatedVariants[variantIndex]
                                            .images || []),
                                        ];

                                        updatedImages.splice(imageIndex, 1);

                                        updatedVariants[variantIndex] = {
                                          ...updatedVariants[variantIndex],
                                          images: updatedImages,
                                          image: updatedImages[0] || "",
                                        };

                                        setEditingProduct({
                                          ...editingProduct,
                                          variants: updatedVariants,
                                        });
                                      }}
                                      className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ),
                              )}

                              {newFiles.map(
                                (file: File, imageIndex: number) => (
                                  <div
                                    key={`${file.name}-${imageIndex}`}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#111] border border-[#444] border-dashed group"
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`New ${imageIndex + 1}`}
                                      className="w-full h-full object-cover opacity-80"
                                    />

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedFiles = [
                                          ...(newVariantImages[variantIndex] ||
                                            []),
                                        ];

                                        updatedFiles.splice(imageIndex, 1);

                                        setNewVariantImages({
                                          ...newVariantImages,
                                          [variantIndex]: updatedFiles,
                                        });
                                      }}
                                      className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ),
                              )}

                              {(variant.images || []).length === 0 &&
                                newFiles.length === 0 && (
                                  <p className="text-[#555] text-xs italic">
                                    No images added yet.
                                  </p>
                                )}
                            </div>
                          </div>

                          {/* Add Images */}
                          <div>
                            <label className="block text-[#888] text-xs mb-2">
                              Add Images
                            </label>

                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                if (!e.target.files) return;

                                const files = Array.from(e.target.files);

                                setNewVariantImages({
                                  ...newVariantImages,
                                  [variantIndex]: [
                                    ...(newVariantImages[variantIndex] || []),
                                    ...files,
                                  ],
                                });

                                e.target.value = "";
                              }}
                              className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#444]"
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>

                {(editingProduct.variants || []).length === 0 && (
                  <div className="border border-dashed border-[#333] rounded-xl p-6 text-center">
                    <p className="text-[#666] text-sm">
                      No frame colors added.
                    </p>
                  </div>
                )}
              </div>

              {/* ===================================== */}
              {/* BUTTONS                                */}
              {/* ===================================== */}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setNewVariantImages({});
                  }}
                  className="px-4 py-2 text-sm text-[#888] hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black text-sm font-medium rounded-xl hover:bg-[#e0e0e0] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && isloading === false && (
        <div className="text-center py-16">
          <p className="text-[#333] font-['Fraunces'] text-lg">
            No products found
          </p>
        </div>
      )}
    </div>
  );
}
