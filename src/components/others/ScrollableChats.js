import { Avatar, Tooltip } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUserAlign,
} from "../../helpers/chatData";

const ScrollableChats = ({ messages }) => {
  const loggedUser = useSelector((state) => state.user);

  //   const isSameUser = (message, i) => {
  //     return (
  //       i < messages.length - 1 &&
  //       (messages[i + 1].sender._id !== message.sender._id ||
  //         messages[i + 1].sender._id !== undefined) &&
  //       messages[i].sender._id !== loggedUser.id
  //     );
  //   };

  //   const isLastMessage = (i) => {
  //     return (
  //       i === messages.length - 1 &&
  //       messages[messages.length - 1].sender._id !== loggedUser.id &&
  //       messages[messages.length - 1].sender._id
  //     );
  //   };

  return (
    <ScrollableFeed>
      {messages.length > 0 &&
        messages.map((item, idx) => (
          <div style={{ display: "flex" }} key={item._id}>
            {(isSameSender(messages, item, idx, loggedUser.id) ||
              isLastMessage(messages, idx, loggedUser.id)) && (
              <Tooltip
                label={item.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={item.sender.name}
                  pic={item?.sender?.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  item.sender._id === loggedUser.id ? "#BEE3F8" : "#B9F5D0",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(
                  messages,
                  item,
                  idx,
                  loggedUser.id
                ),
                marginTop: isSameUserAlign(messages, item, idx, loggedUser.id)
                  ? 3
                  : 10,
              }}
            >
              {item.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
