import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
  },
  reducers: {
    allChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats = [action.payload, ...state.chats];
    },
    clearChats: (state) => {
      state.chats = [];
    },
  },
});

export const { allChats, addChat, clearChats } = chatSlice.actions;

export default chatSlice.reducer;
