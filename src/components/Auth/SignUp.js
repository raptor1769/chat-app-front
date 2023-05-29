import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loaderStart, loaderStop } from "../../redux/Loader";
import { showAlert, hideAlert } from "../../redux/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import generateHeaders from "../../config";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cShow, setCShow] = useState(false);
  const [pic, setPic] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headers = generateHeaders();

  let isLoading = useSelector((state) => state.loader.value);

  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = (id) => {
    id === 1 && setShow(!show);
    id === 2 && setCShow(!cShow);
  };

  const postDetails = async (pics) => {
    if (pics === undefined) {
      dispatch(showAlert({ type: "warning", message: "Select an image" }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }

    if (pics.type.includes("image")) {
      dispatch(loaderStart());
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dqusthx5b");
      const uploadData = await axios.post(
        `https://api.cloudinary.com/v1_1/dqusthx5b/image/upload`,
        data
      );
      setPic(uploadData?.data?.url);
      dispatch(loaderStop());
    } else {
      dispatch(
        showAlert({ type: "warning", message: "Only images are allowed" })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }
  };

  const submitHandler = async () => {
    if (
      name?.length === 0 ||
      email?.length === 0 ||
      password?.length === 0 ||
      confirmPassword?.length === 0
    ) {
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

    if (password !== confirmPassword) {
      dispatch(
        showAlert({ type: "warning", message: "Passwords are not matching" })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      return;
    }
    try {
      dispatch(loaderStart());
      const response = await axios.post(
        `${process.env.REACT_APP_PROXY}/user/register`,
        { name: name, email: email, password: password, pic: pic },
        headers
      );
      dispatch(
        showAlert({
          type: "success",
          message: "Registration successful",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 2000);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/chats");
      dispatch(loaderStop());
      // console.log(response);
    } catch (err) {
      dispatch(
        showAlert({
          type: "warning",
          message: err?.response?.data?.message + ", please login",
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => handleClick(1)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="c-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={cShow ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => handleClick(2)}>
              {cShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        marginTop={15}
        onClick={submitHandler}
        isLoading={isLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
