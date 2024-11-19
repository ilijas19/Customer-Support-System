import { ORIGIN } from "./utils.js";
export const state = {
  currentUser: {},
};

export const loginUser = async (email, password) => {
  try {
    const result = await axios.post(`/api/v1/auth/login`, {
      email,
      password,
    });

    alert(result.data.msg);
    if (result.data.tokenUser.role === "operator") {
      window.location.href = "/operator";
    }
    if (result.data.tokenUser.role === "user") {
      window.location.href = "/userChat";
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.msg);
  }
};

export const registerUser = async (username, email, password) => {
  try {
    // console.log(username, email, password);
    const result = await axios.post("/api/v1/auth/register", {
      username,
      email,
      password,
    });
    alert(result.data.msg);
    window.location.href = "/login";
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const getCurrentUser = async () => {
  try {
    const result = await axios.get("/api/v1/auth/showMe");
    return result.data.currentUser;
  } catch (error) {
    console.log(error);
  }
};

export const createConversation = async (operatorId, userId) => {
  try {
    const result = await axios.post("/api/v1/conversation", {
      operatorId,
      userId,
    });
    alert(result.data.msg);
  } catch (error) {
    alert(error.response.data.msg);
  }
};
