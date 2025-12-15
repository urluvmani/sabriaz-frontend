import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cartState")) || {
  cartItems: [],
  totalQty: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: savedCart,

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.cartItems.find((x) => x._id === item._id);

      if (exist) {
        exist.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.totalQty++;
      state.totalAmount += item.price;

      localStorage.setItem("cartState", JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((x) => x._id === id);

      if (item) {
        state.totalQty -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.cartItems = state.cartItems.filter((x) => x._id !== id);
      }

      localStorage.setItem("cartState", JSON.stringify(state));
    },

    increaseQty: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((x) => x._id === id);

      if (item) {
        item.quantity++;
        state.totalQty++;
        state.totalAmount += item.price;
      }

      localStorage.setItem("cartState", JSON.stringify(state));
    },

    decreaseQty: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((x) => x._id === id);

      if (item.quantity > 1) {
        item.quantity--;
        state.totalQty--;
        state.totalAmount -= item.price;
      }

      localStorage.setItem("cartState", JSON.stringify(state));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQty = 0;
      state.totalAmount = 0;

      localStorage.setItem("cartState", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
