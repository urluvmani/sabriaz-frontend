import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  loading: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const updated = action.payload;
      state.products = state.products.map((p) =>
        p._id === updated._id ? updated : p
      );
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
