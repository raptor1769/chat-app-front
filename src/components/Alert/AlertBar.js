import { Alert, AlertIcon } from "@chakra-ui/react";

const AlertBar = ({ message, type }) => {
  // types = error, success, warning, info
  return (
    <Alert status={type}>
      <AlertIcon />
      {message}
    </Alert>
  );
};

export default AlertBar;
