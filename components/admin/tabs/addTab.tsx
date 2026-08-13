

import { useState } from 'react';
import { categories } from '@/data/products';

const emptyForm = {
  name: '',
  category: 'Aviator',
  price: '',
  originalPrice: '',
  description: '',
  frameShape: '',
  frameMaterial: '',
  lensWidth: '',
  bridgeWidth: '',
  templeLength: '',
  isNew: false,
  isBestseller: false,
};

const inputCls =
  'w-full bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#333] outline-none focus:border-[#333] transition-colors';

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[#555] text-[10px] uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-[#666]"> *</span>}
      </label>

      {children}
    </div>
  );
}

type Variant = {
  color: string;
  images: File[];
  stock: number;
};

export default function AddTab() {
  const [form, setForm] = useState(emptyForm);

  // General product images
  const [images, setImages] = useState<File[]>([]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Product color variants
  const [variants, setVariants] = useState<Variant[]>([
    {
      color: '',
      images: [],
      stock: 0,
    },
  ]);

  // ----------------------------------------
  // Update normal product fields
  // ----------------------------------------

  const handleFormChange = (
    field: keyof typeof emptyForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError('');
    setFormSuccess(false);
  };

  // ----------------------------------------
  // Update variant
  // ----------------------------------------

  const updateVariant = (
    index: number,
    field: 'color' | 'stock',
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );

    setFormError('');
  };

  // ----------------------------------------
  // Add new color
  // ----------------------------------------

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: '',
        images: [],
        stock: 0,
      },
    ]);

    setFormError('');
  };

  // ----------------------------------------
  // Remove color
  // ----------------------------------------

  const removeVariant = (index: number) => {
    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setFormError('');
  };

  // ----------------------------------------
  // Handle images for each color
  // ----------------------------------------

  const handleVariantImages = (
    index: number,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? {
              ...variant,
              images: selectedFiles,
            }
          : variant
      )
    );

    setFormError('');
  };

  // ----------------------------------------
  // General product images
  // ----------------------------------------

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setFormError('');
    }
  };

  // ----------------------------------------
  // Remove general image
  // ----------------------------------------

  const removeGeneralImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ----------------------------------------
  // Remove variant image
  // ----------------------------------------

  const removeVariantImage = (
    variantIndex: number,
    imageIndex: number
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              images: variant.images.filter(
                (_, imgIndex) =>
                  imgIndex !== imageIndex
              ),
            }
          : variant
      )
    );
  };

  // ----------------------------------------
  // Submit
  // ----------------------------------------

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setFormError('');
    setFormSuccess(false);

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!form.name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    if (!form.price) {
      setFormError('Product price is required.');
      return;
    }

    if (!form.description.trim()) {
      setFormError('Product description is required.');
      return;
    }



    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      if (!variant.color.trim()) {
        setFormError(
          `Please enter a color for Color ${i + 1}.`
        );
        return;
      }

      if (variant.images.length === 0) {
        setFormError(
          `Please upload at least one image for ${variant.color}.`
        );
        return;
      }
    }

    // ----------------------------------------
    // FormData
    // ----------------------------------------

    const formData = new FormData();

    // Normal fields
    Object.entries(form).forEach(
      ([key, value]) => {
        formData.append(
          key,
          String(value)
        );
      }
    );


 

    // ----------------------------------------
    // Variant information
    //
    // We send the variant data separately
    // from the actual files.
    // ----------------------------------------

    const variantData = variants.map(
      (variant) => ({
        color: variant.color,
        stock: variant.stock,
      })
    );

    formData.append(
      'variants',
      JSON.stringify(variantData)
    );

    // ----------------------------------------
    // Variant images
    //
    // Each variant gets its own field:
    //
    // variantImages_0
    // variantImages_1
    // variantImages_2
    // ----------------------------------------

    variants.forEach(
      (variant, variantIndex) => {
        variant.images.forEach(
          (file) => {
            formData.append(
              `variantImages_${variantIndex}`,
              file
            );
          }
        );
      }
    );

    // ----------------------------------------
    // Send request
    // ----------------------------------------

    try {
      const response = await fetch(
        'http://localhost:5000/api/products/createProduct',
        {
          method: 'POST',
         credentials: 'include',
        
          body: formData,
        }
      
        
      );

      const data = await response.json();

      if (data.success) {
        setFormError('');
        setFormSuccess(true);

        // Reset form
        setForm(emptyForm);

        // Reset general images
        setImages([]);

        // Reset variants
        setVariants([
          {
            color: '',
            images: [],
            stock: 0,
          },
        ]);
      } else {
        setFormError(
          data.message ||
            'Failed to add product'
        );
      }
    } catch (error) {
      console.error(
        'Create product error:',
        error
      );

      setFormError(
        'Network error or server is down'
      );
    }
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div>
      <h2 className="text-white font-['Fraunces'] text-2xl mb-1">
        Add New Glasses
      </h2>

      <p className="text-[#444] text-xs mb-6">
        Fill in the details below to add a new
        product to your catalogue.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* =====================================
            BASIC INFO
        ====================================== */}

        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-4">
            Basic Info
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <Field
              label="Product Name"
              required
            >
              <input
                value={form.name}
                onChange={(e) =>
                  handleFormChange(
                    'name',
                    e.target.value
                  )
                }
                placeholder="e.g. Eclipse Pro"
                className={inputCls}
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) =>
                  handleFormChange(
                    'category',
                    e.target.value
                  )
                }
                className={inputCls}
              >
                {categories
                  .filter(
                    (c: string) =>
                      c !== 'All'
                  )
                  .map((c: string) => (
                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="Frame Shape">
              <input
                value={form.frameShape}
                onChange={(e) =>
                  handleFormChange(
                    'frameShape',
                    e.target.value
                  )
                }
                placeholder="e.g. Aviator"
                className={inputCls}
              />
            </Field>

          </div>

          <div className="mt-3">
            <Field
              label="Description"
              required
            >
              <textarea
                value={form.description}
                onChange={(e) =>
                  handleFormChange(
                    'description',
                    e.target.value
                  )
                }
                placeholder="Describe the product..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </div>

        {/* =====================================
            PRICING
        ====================================== */}

        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-4">
            Pricing
          </p>

          <div className="grid grid-cols-2 gap-3">

            <Field
              label="Sale Price PKR)"
              required
            >
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  handleFormChange(
                    'price',
                    e.target.value
                  )
                }
                placeholder="189"
                className={inputCls}
              />
            </Field>

            <Field label="Original Price (PKR)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) =>
                  handleFormChange(
                    'originalPrice',
                    e.target.value
                  )
                }
                placeholder="249 (optional)"
                className={inputCls}
              />
            </Field>

          </div>
        </div>

        {/* =====================================
            FRAME COLORS
        ====================================== */}

        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-[#444] text-[10px] tracking-widest uppercase">
                Frame Colors
              </p>

              <p className="text-[#555] text-xs mt-1">
                Add colors and upload images
                for each color.
              </p>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-[#e0e0e0] transition-colors"
            >
              + Add Color
            </button>

          </div>

          <div className="space-y-4">

            {variants.map(
              (variant, index) => (
                <div
                  key={index}
                  className="border border-[#222] rounded-xl p-4 space-y-4"
                >

                  {/* Color Header */}

                  <div className="flex items-center justify-between">

                    <h3 className="text-white font-medium text-sm">
                      Color {index + 1}
                      {variant.color
                        ? ` — ${variant.color}`
                        : ''}
                    </h3>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(
                            index
                          )
                        }
                        className="text-red-500 text-xs hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  {/* Color + Stock */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <Field
                      label="Color Name"
                      required
                    >
                      <input
                        type="text"
                        placeholder="e.g. Red"
                        value={
                          variant.color
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'color',
                            e.target.value
                          )
                        }
                        className={
                          inputCls
                        }
                      />
                    </Field>

                    <Field label="Stock">
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        value={
                          variant.stock
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'stock',
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className={
                          inputCls
                        }
                      />
                    </Field>

                  </div>

                  {/* =================================
                      IMAGES FOR THIS COLOR
                  ================================== */}

                  <Field
                    label={`${
                      variant.color ||
                      'Color'
                    } Images`}
                    required
                  >

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleVariantImages(
                          index,
                          e.target.files
                        )
                      }
                      className={inputCls}
                    />

                  </Field>

                  {/* =================================
                      IMAGE PREVIEWS
                  ================================== */}

                  {variant.images
                    .length > 0 && (

                    <div className="space-y-2">

                      <p className="text-[#555] text-[10px] uppercase tracking-wide">
                        Selected Images
                      </p>

                      <div className="flex gap-3 overflow-x-auto pb-1">

                        {variant.images.map(
                          (
                            file,
                            imageIndex
                          ) => (
                            <div
                              key={
                                imageIndex
                              }
                              className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-[#222] bg-[#111]"
                            >

                              <img
                                src={URL.createObjectURL(
                                  file
                                )}
                                alt={`${variant.color} image ${
                                  imageIndex +
                                  1
                                }`}
                                className="w-full h-full object-cover"
                              />

                              {/* Remove image */}

                              <button
                                type="button"
                                onClick={() =>
                                  removeVariantImage(
                                    index,
                                    imageIndex
                                  )
                                }
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/80 text-white text-xs flex items-center justify-center hover:bg-red-600"
                              >
                                ×
                              </button>

                              {/* Main image label */}

                              {imageIndex ===
                                0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] text-center py-1">
                                  Main
                                </div>
                              )}

                            </div>
                          )
                        )}

                      </div>

                    </div>

                  )}

                </div>
              )
            )}

          </div>
        </div>

        {/* =====================================
            FRAME SPECS
        ====================================== */}

        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">

          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-4">
            Frame Specs
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

            <Field label="Material">
              <input
                value={
                  form.frameMaterial
                }
                onChange={(e) =>
                  handleFormChange(
                    'frameMaterial',
                    e.target.value
                  )
                }
                placeholder="Titanium"
                className={inputCls}
              />
            </Field>

            <Field label="Lens Width">
              <input
                value={
                  form.lensWidth
                }
                onChange={(e) =>
                  handleFormChange(
                    'lensWidth',
                    e.target.value
                  )
                }
                placeholder="54mm"
                className={inputCls}
              />
            </Field>

            <Field label="Bridge Width">
              <input
                value={
                  form.bridgeWidth
                }
                onChange={(e) =>
                  handleFormChange(
                    'bridgeWidth',
                    e.target.value
                  )
                }
                placeholder="16mm"
                className={inputCls}
              />
            </Field>

            <Field label="Temple Length">
              <input
                value={
                  form.templeLength
                }
                onChange={(e) =>
                  handleFormChange(
                    'templeLength',
                    e.target.value
                  )
                }
                placeholder="140mm"
                className={inputCls}
              />
            </Field>

          </div>
        </div>



        {/* =====================================
            LABELS
        ====================================== */}

        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">

          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-4">
            Labels
          </p>

          <div className="flex gap-4">

            {/* NEW */}

            <label className="flex items-center gap-2.5 cursor-pointer">

              <div
                onClick={() =>
                  handleFormChange(
                    'isNew',
                    !form.isNew
                  )
                }
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  form.isNew
                    ? 'bg-white border-white'
                    : 'border-[#2a2a2a]'
                }`}
              >

                {form.isNew && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}

              </div>

              <span className="text-[#888] text-sm">
                Mark as New
              </span>

            </label>

            {/* BESTSELLER */}

            <label className="flex items-center gap-2.5 cursor-pointer">

              <div
                onClick={() =>
                  handleFormChange(
                    'isBestseller',
                    !form.isBestseller
                  )
                }
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  form.isBestseller
                    ? 'bg-white border-white'
                    : 'border-[#2a2a2a]'
                }`}
              >

                {form.isBestseller && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}

              </div>

              <span className="text-[#888] text-sm">
                Mark as Bestseller
              </span>

            </label>

          </div>

        </div>

        {/* =====================================
            ERROR
        ====================================== */}

        {formError && (
          <p className="text-[#ef9a9a] text-sm bg-[#2a0000] border border-[#5a0000] rounded-xl px-4 py-3">
            {formError}
          </p>
        )}

        {/* =====================================
            SUCCESS
        ====================================== */}

        {formSuccess && (
          <p className="text-[#81c784] text-sm bg-[#001a00] border border-[#003a00] rounded-xl px-4 py-3">
            ✓ Product added to catalogue
            successfully!
          </p>
        )}

        {/* =====================================
            SUBMIT
        ====================================== */}

        <button
          type="submit"
          className="w-full py-4 bg-white text-black font-semibold text-sm rounded-2xl hover:bg-[#e0e0e0] active:scale-95 transition-all"
        >
          Add to Catalogue
        </button>

      </form>
    </div>
  );
}
