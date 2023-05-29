import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import UserBadge from "../UserCards/UserBadge";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loaderStart, loaderStop } from "../../redux/Loader";
import generateHeaders from "../../config";
import axios from "axios";
import { hideAlert, showAlert } from "../../redux/Alert";
import { selectedChat } from "../../redux/SelectedChat";
import UserListItem from "../UserCards/UserListItem";
import useErrorHandle from "../../custom/ErrorHandle";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, selectedChatProp }) => {
  const [updateName, setUpdateName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  const headers = generateHeaders();
  const errorHandle = useErrorHandle();

  const loggedUser = useSelector((state) => state.user);

  const getSearchDetails = useCallback(async () => {
    try {
      dispatch(loaderStart());
      const { data } = await axios.get(
        `${process.env.REACT_APP_PROXY}/user?search=${search}`,
        headers
      );
      setSearchResult(data);
      dispatch(loaderStop());
    } catch (err) {
      errorHandle(err);
    }
  }, [dispatch, search, headers, errorHandle]);

  useEffect(() => {
    let timerDelay;

    if (search.length === 0) {
      setSearchResult([]);
      return;
    } else {
      timerDelay = setTimeout(() => {
        getSearchDetails();
      }, 1000);
    }

    return () => clearTimeout(timerDelay);
  }, [search]);

  const handleRename = async () => {
    try {
      dispatch(loaderStart());
      const { data } = await axios.put(
        `${process.env.REACT_APP_PROXY}/chat/group`,
        {
          chatId: selectedChatProp._id,
          chatName: updateName.trim(),
        },
        headers
      );
      dispatch(loaderStop());
      setFetchAgain(true);
      dispatch(selectedChat(data));
      setUpdateName("");
      dispatch(
        showAlert({
          type: "success",
          message: "Group name updated",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
    } catch (err) {
      errorHandle(err);
    }
  };

  const handleRemove = async (user) => {
    if (
      selectedChatProp.groupAdmin._id !== loggedUser.id &&
      user._id !== loggedUser.id
    ) {
      dispatch(
        showAlert({
          type: "error",
          message: "Only admin can remove others",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    try {
      dispatch(loaderStart());
      const { data } = await axios.put(
        `${process.env.REACT_APP_PROXY}/chat/removeUsers`,
        { chatId: selectedChatProp._id, userId: user._id },
        headers
      );
      if (user._id === loggedUser.id) {
        dispatch(selectedChat(null));
      } else {
        dispatch(selectedChat(data));
      }
      setFetchAgain(true);
      dispatch(loaderStop());
    } catch (err) {
      errorHandle(err);
    }
  };

  const addToGroup = async (user) => {
    if (selectedChatProp.groupAdmin._id !== loggedUser.id) {
      dispatch(
        showAlert({
          type: "Error",
          message: "Only admin can add or remove users",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    if (selectedChatProp.users.find((u) => u._id === user._id)) {
      dispatch(
        showAlert({
          type: "warning",
          message: "User already added",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    try {
      dispatch(loaderStart());
      const { data } = await axios.put(
        `${process.env.REACT_APP_PROXY}/chat/addUsers`,
        { chatId: selectedChatProp._id, userId: user._id },
        headers
      );
      setFetchAgain(true);
      dispatch(selectedChat(data));
      dispatch(loaderStop());
    } catch (err) {
      errorHandle(err);
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChatProp?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChatProp.users?.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleSelect={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Group name (min. length 3)"
                mb={3}
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
                isDisabled={updateName.trim().length < 3 ? true : false}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            {searchResult?.length > 0 &&
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleSelect={() => addToGroup(user)}
                />
              ))}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemove(loggedUser)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
