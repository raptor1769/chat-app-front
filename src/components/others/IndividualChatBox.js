import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectedChat } from "../../redux/SelectedChat";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import { useEffect, useState } from "react";
import generateHeaders from "../../config";
import useErrorHandle from "../../custom/ErrorHandle";
import "../styles.css";
import axios from "axios";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";
import AnimationComponent from "../../animations/Animation";
import { addNotification } from "../../redux/Notification";

var socket, selectedChatCompare;

const IndividualChatBox = ({ fetchAgain, setFetchAgain, selectedChatProp }) => {
  const notificationsArray = useSelector(
    (state) => state.notifications.notifications
  );

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConn, setSocketConn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [notifications, setNotifications] = useState(notificationsArray);

  const dispatch = useDispatch();
  const headers = generateHeaders();
  const errorHandle = useErrorHandle();

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setNotifications(notificationsArray);
  }, [notificationsArray]);

  const fetchMessages = async () => {
    if (!selectedChatProp) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_PROXY}/api/messages/${selectedChatProp._id}`,
        headers
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChatProp._id);
    } catch (err) {
      errorHandle(err);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim().length > 0) {
      socket.emit("stop typing", selectedChatProp._id);
      try {
        setNewMessage("");

        const { data } = await axios.post(
          `${process.env.REACT_APP_PROXY}/api/messages`,
          {
            content: newMessage,
            chatId: selectedChatProp._id,
          },
          headers
        );
        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {
        errorHandle(err);
      }
    }
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_PROXY);
    socket.emit("setup", loggedUser);
    socket.on("connected", () => setSocketConn(true));
  }, []);

  const getSenderDetails = (users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChatProp;
  }, [selectedChatProp]);

  useEffect(() => {
    let lastTypingTime = new Date().getTime();
    // console.log("hi");
    let timerId = setTimeout(() => {
      var timenow = new Date().getTime();
      var timeDiff = timenow - lastTypingTime;

      if (timeDiff >= 1000 && typing) {
        socket.emit("stop typing", selectedChatProp?._id);
        setTyping(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timerId);
      if (selectedChatCompare?._id !== selectedChatProp?._id) {
        socket.emit("stop typing", selectedChatProp?._id);
        setTyping(false);
      }
    };
  }, [newMessage, selectedChatProp]);

  useEffect(() => {
    const handleMessageRec = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (
          !notifications.find((item) => item._id === newMessageRecieved._id)
        ) {
          dispatch(addNotification(newMessageRecieved));
          setFetchAgain(true);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    };

    const handleTyping = (room) => {
      if (room === selectedChatCompare?._id) {
        if (isTyping) return;
        setIsTyping(true);
      } else {
        return;
      }
    };

    const handleStopTyping = (room) => {
      if (room === selectedChatCompare?._id) {
        if (!isTyping) return;
        setIsTyping(false);
      } else {
        return;
      }
    };
    socket.on("message recieved", handleMessageRec);

    socket.on("typing", handleTyping);

    socket.on("stop typing", handleStopTyping);

    return () => {
      socket.off("message recieved", handleMessageRec);
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
    };
  });

  // console.log(messages);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConn) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChatProp._id);
    }
  };

  return (
    <>
      {selectedChatProp ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => dispatch(selectedChat(null))}
            />
            {!selectedChatProp?.isGroupChat ? (
              <>
                {getSenderDetails(selectedChatProp.users).name}{" "}
                <ProfileModal user={getSenderDetails(selectedChatProp.users)} />{" "}
              </>
            ) : (
              <>
                {selectedChatProp.chatName}
                <UpdateGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  selectedChatProp={selectedChatProp}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChats messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div
                  style={{
                    height: "40px",
                    width: "60px",
                    position: "relative",
                  }}
                >
                  <AnimationComponent />
                  {/* <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /> */}
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Select a chat to begin
          </Text>
        </Box>
      )}
    </>
  );
};

export default IndividualChatBox;
