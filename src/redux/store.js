// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import { authApi } from "../api/authApi";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
      cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
