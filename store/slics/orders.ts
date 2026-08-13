import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from '@/types';

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.items.unshift(action.payload);
    },
   
    setInitialOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
    },
    clearOrders(state) {
      state.items = [];
    },
  },
});

export const { addOrder, setInitialOrders, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
