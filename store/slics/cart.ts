import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  buyNowItem: CartItem | null;
}

const initialState: CartState = {
  items: [],
  buyNowItem: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; color?: string }>,
    ) {
      const { product, color = "Matte Black" } = action.payload;
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.selectedColor === color,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1, selectedColor: color });
      }
    },
    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; color: string }>,
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.product.id === action.payload.productId &&
            i.selectedColor === action.payload.color
          ),
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        color: string;
        quantity: number;
      }>,
    ) {
      const { productId, color, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (i) => !(i.product.id === productId && i.selectedColor === color),
        );
      } else {
        const item = state.items.find(
          (i) => i.product.id === productId && i.selectedColor === color,
        );
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
    setInitialCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setBuyNowItem(
      state,
      action: PayloadAction<{ product: Product; color: string }>,
    ) {
      const { product, color } = action.payload;
      state.buyNowItem = { product, quantity: 1, selectedColor: color };
    },
    clearBuyNow(state) {
      state.buyNowItem = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setInitialCart,
  setBuyNowItem,
  clearBuyNow,
} = cartSlice.actions;
export default cartSlice.reducer;
