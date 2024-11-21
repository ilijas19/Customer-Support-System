import * as model from "./model.js";
import authView from "./views/authView.js";
import userView from "./views/userView.js";
import operatorView from "./views/operatorView.js";

const authController = () => {
  authView.addLoginFormListener(model.loginUser);
  authView.addRegisterFormListener(model.registerUser);
};

const userPageController = async (socket, currentUser) => {
  if (window.location.pathname === "/userChat") {
    userView._usernameElement.textContent = currentUser.username;
    userView._messageInput.style.pointerEvents = "none";
    //EXISTING CHAT(user recconection)
    socket.on("checkExistingChat", async (user) => {
      const { conversations } = await model.getUserConversations(user);
      //////////continue here
      console.log(conversations);
    });
    //CHAT START
    socket.on("chatStart", ({ operator, user }) => {
      console.log(`Chat Beetween ${operator.username} and ${user.username}`);
      userView.chatInit(model.state);
      userView.renderMessage(
        `Operator has joined your chat. You can ask your question`,
        `${operator.username}`
      );
      userView.addMessageFormListener(socket, user.username, user);
    });
    //RECIEVING MESSAGES
    socket.on("message", (formatedMessage) => {
      console.log(formatedMessage);
      userView.renderMessage(formatedMessage.msg, formatedMessage.from);
    });
  }
};

const operatorPageController = async (socket, currentUser) => {
  let currentFilter = "pending"; // Default filter

  if (window.location.pathname === "/operator") {
    operatorView._operatorName.textContent = currentUser.username;

    // UPDATE QUEUE
    socket.on("updateQueue", (users) => {
      if (currentFilter === "pending") {
        operatorView.renderChatsAddListener(users, async (user) => {
          // Operator joins chat
          model.state.currentUser.room = user.username;

          //CREATING CONVERSATION
          // await model.createConversation(
          //   model.state.currentUser.userId,
          //   user.userId
          // );

          socket.emit("operatorJoin", {
            operator: model.state.currentUser,
            user,
          });

          socket.emit("removeFromQueue", user);
        });
      }
    });

    // CHAT START
    socket.on("chatStart", ({ operator, user }) => {
      console.log(`Chat Between ${operator.username} and ${user.username}`);
      operatorView.chatInit(operator, user);
      operatorView.addMessageFormListener(socket, user.username, operator);
    });

    // SWITCH CONVERSATIONS
    operatorView.addSelectElListener(async (value) => {
      currentFilter = value; // Update filter state
      if (value === "pending") {
        socket.emit("requestQueueUpdate"); // Trigger server-side queue update
      } else {
        const conversations = await model.getOperatorConversations(value);
        operatorView.renderDatabaseConversations(conversations);
      }
    });

    // RECEIVING MESSAGES
    socket.on("message", (formattedMessage) => {
      operatorView.renderMessage(formattedMessage.msg, formattedMessage.from);
    });
  }
};

const socketController = async () => {
  if (
    window.location.pathname === "/operator" ||
    window.location.pathname === "/userChat"
  ) {
    const currentUser = await model.getCurrentUser();
    const socket = io();
    //GETTING SOCKET ID ON CONNECTION
    socket.on("socketConnected", (data) => {
      //SETTING SOCKETID PROPERTY ON CURRENT USER & SENDING USER BACK TO CLIENT
      currentUser.socketId = data;
      model.state.currentUser = currentUser;
      // console.log(currentUser); //currentuser
      socket.emit("userJoin", currentUser);
    });
    //CALLING SPECIFIC PAGE CONTROLLERS
    userPageController(socket, currentUser);
    operatorPageController(socket, currentUser);
  }
};

const init = async () => {
  authController();
  socketController();
};

init();
