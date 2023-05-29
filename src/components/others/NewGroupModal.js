import {
  Box,
  Button,
  FormControl,
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
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../redux/Loader";
import { hideAlert, showAlert } from "../../redux/Alert";
import axios from "axios";
import UserListItem from "../UserCards/UserListItem";
import UserBadge from "../UserCards/UserBadge";
import { addChat } from "../../redux/Chats";
import { selectedChat } from "../../redux/SelectedChat";
import generateHeaders from "../../config";
import useErrorHandle from "../../custom/ErrorHandle";

const NewGroupModal = ({ children }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const dispatch = useDispatch();
  const headers = generateHeaders();
  const errorHandle = useErrorHandle();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
  }, [search, setSearchResult]);

  const addToGroup = (user) => {
    if (selectedUsers.includes(user)) {
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
    setSelectedUsers([...selectedUsers, user]);
    return;
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id));
  };

  const handleSubmit = async () => {
    if (selectedUsers.length < 2) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Add atleast two users to a group",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }
    try {
      dispatch(loaderStart());
      const { data } = await axios.post(
        `${process.env.REACT_APP_PROXY}/chat/group`,
        {
          name: groupName.trim(),
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        headers
      );
      dispatch(loaderStop());
      dispatch(addChat(data));
      dispatch(selectedChat(data));
      onClose();
      setGroupName("");
      setSearch("");
      setSearchResult([]);
      setSelectedUsers([]);
      dispatch(
        showAlert({
          type: "success",
          message: "Group created successfully",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
    } catch (err) {
      errorHandle(err);
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group name (min. length 3)"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users, eg: John, Steve, Sam"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </FormControl>
            {/* selected users */}
            <Box w="100%" display={"flex"} flexWrap={"wrap"}>
              {selectedUsers?.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleSelect={() => handleDelete(user)}
                />
              ))}
            </Box>
            {/* render search users */}
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
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={groupName.trim().length < 3 ? true : false}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewGroupModal;
