const generateHeaders = () => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
};

export default generateHeaders;
