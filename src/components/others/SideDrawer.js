import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { loaderStart, loaderStop } from "../../redux/Loader";
import { hideAlert, showAlert } from "../../redux/Alert";
import axios from "axios";
import ChatLoading from "../Loader/ChatLoading";
import UserListItem from "../UserCards/UserListItem";
import { selectedChat } from "../../redux/SelectedChat";
import { addChat } from "../../redux/Chats";
import generateHeaders from "../../config";
import useLogout from "../../custom/Logout";
import useErrorHandle from "../../custom/ErrorHandle";

const SideDrawer = ({ loggedUser }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const chats = useSelector((state) => state.chats.chats);

  const dispatch = useDispatch();
  const logout = useLogout();
  const errorHandle = useErrorHandle();

  const headers = generateHeaders();

  const logoutHandler = () => {
    dispatch(loaderStart());
    logout();
    dispatch(loaderStop());
  };

  const searchHandler = async () => {
    if (search.length < 3) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Enter atleast 3 characters to search",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_PROXY}/user?search=${search}`,
        headers
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      errorHandle(err);
    }
  };

  const accessChat = async (id) => {
    try {
      dispatch(loaderStart());
      const { data } = await axios.post(
        `${process.env.REACT_APP_PROXY}/chat`,
        { userId: id },
        headers
      );
      dispatch(loaderStop());
      if (!chats.find((c) => c._id === data._id)) dispatch(addChat(data));
      dispatch(selectedChat(data));
      onClose();
    } catch (err) {
      errorHandle(err);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Tooltip fontSize="2xl" fontFamily="Work sans">
          Ping-A-Peer
        </Tooltip>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" margin={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={1}>
              <Avatar
                size="sm"
                cursor="pointer"
                src={loggedUser?.pic}
                name={loggedUser?.name}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={loggedUser}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Enter name or mail"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleSelect={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
