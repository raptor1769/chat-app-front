import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./redux/Loader";
import authReducer from "./redux/Auth";
import alertReducer from "./redux/Alert";
import chatReducer from "./redux/Chats";
import selectedChatReducer from "./redux/SelectedChat";

export default configureStore({
  reducer: {
    loader: loaderReducer,
    user: authReducer,
    alert: alertReducer,
    chats: chatReducer,
    selectedChat: selectedChatReducer,
  },
});
