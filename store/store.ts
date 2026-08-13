import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./slics/wishlist";
import cartReducer from "./slics/cart";
import ordersReducer from "./slics/orders";
import authReducer from "./slics/auth";

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer,

  },
});

export function startPersistence() {
  store.subscribe(() => {
    try {
      const state = store.getState();
      localStorage.setItem('lensco:cart', JSON.stringify(state.cart.items));
      localStorage.setItem('lensco:wishlist', JSON.stringify(state.wishlist.items));
      localStorage.setItem('lensco:orders', JSON.stringify(state.orders.items));
      localStorage.setItem('lensco:auth', JSON.stringify(state.auth.user));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;