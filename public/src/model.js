import { ORIGIN } from "./utils.js";
export const state = {
  currentUser: {},
  conversation: {},
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
    return result.data;
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const getOperatorConversations = async (status) => {
  try {
    const result = await axios.get(
      `/api/v1/conversation/operator/conversations?status=${status}`
    );
    return result.data;
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const getUserConversations = async () => {
  try {
    const result = await axios.get(`/api/v1/conversation/user/conversations`);
    return result.data;
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const getUserConversationById = async (id) => {
  try {
    const result = await axios.post(
      "/api/v1/conversation/user/findConversationById",
      { id }
    );
    console.log(result.data);
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const createTextMessage = async (
  conversationId,
  senderUsername,
  text
) => {
  try {
    const result = await axios.post("/api/v1/message/text", {
      conversationId,
      senderUsername,
      text,
    });
    console.log(result.data);
  } catch (error) {
    alert(error.response.data.msg);
  }
};
