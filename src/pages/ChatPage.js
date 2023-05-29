import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../components/others/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const reduxUser = useSelector((state) => state.user);

  const [user, setUser] = useState(reduxUser);
  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token === null) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    setUser(reduxUser);
  }, [reduxUser]);

  return (
    <div style={{ width: "100%" }}>
      {user?.token !== null && <SideDrawer loggedUser={user} />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user?.token !== null && (
          <>
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </>
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
