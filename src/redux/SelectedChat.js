import { createSlice } from "@reduxjs/toolkit";

export const selectedChatSlice = createSlice({
  name: "chats",
  initialState: {
    chatData: null,
  },
  reducers: {
    selectedChat: (state, action) => {
      state.chatData = action.payload;
    },
  },
});

export const { selectedChat } = selectedChatSlice.actions;

export default selectedChatSlice.reducer;
