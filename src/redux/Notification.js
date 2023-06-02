import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = action.payload;
      const isNotificationExists = state.notifications.some(
        (item) => item._id === notification._id
      );
      if (!isNotificationExists) {
        state.notifications = [notification, ...state.notifications];
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (item) => item.chat._id !== action.payload.chat._id
      );
    },
    clearNotification: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
