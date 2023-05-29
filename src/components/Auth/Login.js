import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideAlert, showAlert } from "../../redux/Alert";
import { loaderStart, loaderStop } from "../../redux/Loader";
import { loginSuccess } from "../../redux/Auth";
import generateHeaders from "../../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headers = generateHeaders();

  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async () => {
    if (email?.length === 0 || password?.length === 0) {
      dispatch(
        showAlert({ type: "warning", message: "Fill all the required fields" })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    if (!isValidEmail(email)) {
      dispatch(showAlert({ type: "warning", message: "Invalid email format" }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    try {
      dispatch(loaderStart());
      const response = await axios.post(
        `${process.env.REACT_APP_PROXY}/user/login`,
        { email: email, password: password },
        headers
      );
      dispatch(
        showAlert({
          type: "success",
          message: "Login successful",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(loginSuccess(response.data));
      navigate("/chats");
      dispatch(loaderStop());
    } catch (err) {
      dispatch(
        showAlert({
          type: "warning",
          message: err?.response?.data?.message,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);

      console.log(err);
      dispatch(loaderStop());
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Your Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="login-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        marginTop={15}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        variant="solid"
        width={"100%"}
        marginTop={15}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Creds
      </Button>
    </VStack>
  );
};

export default Login;
