import { useDispatch } from "react-redux";
import { hideAlert, showAlert } from "../redux/Alert";
import { loaderStop } from "../redux/Loader";
import { logout } from "../redux/Auth";

const useErrorHandle = (err) => {
  const dispatch = useDispatch();
  const errorHandle = (err) => {
    dispatch(
      showAlert({
        type: "error",
        message: err.response.data.message,
      })
    );
    setTimeout(() => {
      dispatch(hideAlert());
    }, 2000);
    if (err.response.status === 401 || err.response.status === 403) {
      logout();
    }
    console.log(err);
    dispatch(loaderStop());
  };
  return errorHandle;
};

export default useErrorHandle;
