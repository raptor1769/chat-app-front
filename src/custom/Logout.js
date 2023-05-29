import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { logout } from "../redux/Auth";
import { clearChats } from "../redux/Chats";
import { selectedChat } from "../redux/SelectedChat";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("user");
      dispatch(logout());
      dispatch(clearChats());
      dispatch(selectedChat(null));
      navigate("/", { replace: true });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }, [dispatch, navigate]);

  return handleLogout;
};

export default useLogout;
