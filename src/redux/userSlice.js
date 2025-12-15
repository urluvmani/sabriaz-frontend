import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("sabriaz_user")) || null,
  token: localStorage.getItem("sabriaz_token") || null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("sabriaz_user", JSON.stringify(user));
      localStorage.setItem("sabriaz_token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("sabriaz_user");
      localStorage.removeItem("sabriaz_token");
    }
  }
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
