import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { allChats } from "../redux/Chats";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./Loader/ChatLoading";
import { selectedChat } from "../redux/SelectedChat";
import NewGroupModal from "./others/NewGroupModal";
import generateHeaders from "../config";
import useErrorHandle from "../custom/ErrorHandle";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const reduxSelectedChat = useSelector((state) => state.selectedChat.chatData);
  const reduxChats = useSelector((state) => state.chats.chats);
  const reduxUser = useSelector((state) => state.user);

  const [selectedChatLocal, setSelectedChatLocal] = useState(reduxSelectedChat);
  const [chats, setChats] = useState(reduxChats);
  const [isLoading, setIsLoading] = useState(false);

  const headers = generateHeaders();
  const dispatch = useDispatch();
  const errorHandle = useErrorHandle();

  useEffect(() => {
    setSelectedChatLocal(reduxSelectedChat);
  }, [reduxSelectedChat]);

  useEffect(() => {
    setChats(reduxChats);
  }, [reduxChats]);

  const fetchChats = useCallback(async () => {
    if (!reduxUser?.token) {
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_PROXY}/chat`,
        headers
      );
      setIsLoading(false);
      dispatch(allChats(data));
    } catch (err) {
      errorHandle(err);
      setIsLoading(false);
    }
  }, [dispatch, headers, reduxUser?.token, errorHandle]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (fetchAgain) {
      fetchChats();
      setFetchAgain(false);
    }
  }, [fetchAgain, fetchChats, setFetchAgain]);

  const getSender = (users) => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <Box
      display={{ base: selectedChatLocal ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={"white"}
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <NewGroupModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </NewGroupModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {isLoading && <ChatLoading />}
        {!isLoading && chats?.length > 0 ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => {
              return (
                <Box
                  key={chat._id}
                  onClick={() => dispatch(selectedChat(chat))}
                  cursor="pointer"
                  bg={
                    selectedChatLocal?._id === chat._id ? "#38B2AC" : "#E8E8E8"
                  }
                  color={
                    selectedChatLocal?._id === chat._id ? "white" : "black"
                  }
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroupChat ? getSender(chat.users) : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Text
            display="flex"
            height="100%"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
          >
            Select a user to start chat
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
