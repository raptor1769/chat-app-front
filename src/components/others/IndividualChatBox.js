import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { selectedChat } from "../../redux/SelectedChat";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";

const IndividualChatBox = ({ fetchAgain, setFetchAgain, selectedChatProp }) => {
  const dispatch = useDispatch();
  const getSenderDetails = (users) => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    return users[0]._id === loggedUser._id ? users[1] : users[0];
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
            Messages Here
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
