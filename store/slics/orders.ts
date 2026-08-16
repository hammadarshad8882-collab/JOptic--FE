import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderStatus } from "@/types";

interface OrdersState {
  orderCount: any;
  items: Order[];
}

const initialState: OrdersState = {
  orderCount: 0,
  items: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
   setOrderCount(state, action: PayloadAction<number>) {
      state.orderCount = action.payload;
    },
    
  },
});

export const { setOrderCount } = ordersSlice.actions;
export default ordersSlice.reducer;
