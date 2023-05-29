import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import IndividualChatBox from "./others/IndividualChatBox";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const reduxSelectedChat = useSelector((state) => state.selectedChat.chatData);
  const [selectedChat, setSelectedChat] = useState(reduxSelectedChat);

  useEffect(() => {
    setSelectedChat(reduxSelectedChat);
  }, [reduxSelectedChat]);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "65%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <IndividualChatBox
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        selectedChatProp={selectedChat}
      />
    </Box>
  );
};

export default ChatBox;
