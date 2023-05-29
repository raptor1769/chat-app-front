import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: JSON.parse(localStorage.getItem("user"))?._id || null,
    name: JSON.parse(localStorage.getItem("user"))?.name || null,
    email: JSON.parse(localStorage.getItem("user"))?.email || null,
    token: JSON.parse(localStorage.getItem("user"))?.token || null,
    pic: JSON.parse(localStorage.getItem("user"))?.pic || null,
    error: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.pic = action.payload.pic;
      state.error = false;
    },
    loginFailure: (state, action) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
      state.pic = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
      state.pic = null;
      state.error = false;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
