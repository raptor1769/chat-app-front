import "./App.scss";
import { useSelector } from "react-redux";
import Loader from "./components/Loader/Loader";
import AlertBar from "./components/Alert/AlertBar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

function App() {
  let isLoading = useSelector((state) => state.loader.value);
  let showAlert = useSelector((state) => state.alert);
  return (
    <div className="App">
      {isLoading && <Loader />}
      {showAlert.value && (
        <div className="alert-bar">
          <AlertBar type={showAlert.type} message={showAlert.message} />
        </div>
      )}
      <div className="app-data">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
