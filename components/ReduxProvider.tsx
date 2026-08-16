"use client";

import { Provider } from "react-redux";
import { store, startPersistence } from "@/store/store";
import { useEffect } from "react";
import { setInitialCart } from "@/store/slics/cart";
import { setInitialWishlist } from "@/store/slics/wishlist";
import { setOrderCount } from "@/store/slics/orders";
import { setUser } from "@/store/slics/auth";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 1. First rehydrate from localStorage
    try {
      const savedCart = localStorage.getItem("lensco:cart");
      if (savedCart) {
        store.dispatch(setInitialCart(JSON.parse(savedCart)));
      }
      const savedWishlist = localStorage.getItem("lensco:wishlist");
      if (savedWishlist) {
        store.dispatch(setInitialWishlist(JSON.parse(savedWishlist)));
      }
      const savedOrderCount = localStorage.getItem("lensco:orderCount");
      if (savedOrderCount) {
        store.dispatch(setOrderCount(JSON.parse(savedOrderCount)));
      }
      const savedAuth = localStorage.getItem("lensco:auth");
      if (savedAuth && savedAuth !== "null") {
        store.dispatch(setUser(JSON.parse(savedAuth)));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }

    // 2. Only start persisting AFTER rehydration so we never overwrite with empty state
    startPersistence();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
