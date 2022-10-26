import axios from "axios";

const getUser = async () => {
  const { data } = await axios.get("http://localhost:3001/auth/user", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  return data;
};

export const authService = { getUser };
