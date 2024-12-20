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
      // -no active conversation
      if (conversations.length === 0) {
        socket.emit("noExistingChat");
      } else {
        socket.emit("existingChat", conversations[0]);
      }
      // has existing active conversation
    });
    //CHAT START
    socket.on("chatStart", ({ operator, user }) => {
      userView.chatInit(model.state);
      userView.renderMessage(
        `Operator has joined your chat. You can ask your question`,
        `${operator.username}`
      );
      userView.addMessageFormListener(socket, user.username, user);
    });
    //RECIEVING MESSAGES
    socket.on("message", async (formatedMessage) => {
      userView.renderMessage(formatedMessage.msg, formatedMessage.from);

      // Emit to the server only if the current operator is the sender
      //Storing messages to database
      if (formatedMessage.from === model.state.currentUser.username) {
        socket.emit("sendMessageToServer", {
          msg: formatedMessage.msg,
          from: formatedMessage.from,
          conversation: model.state.conversation,
        });
      }
    });
    //HERE
    socket.on("reconnectionExistingChat", async (conversation) => {
      //setting conversation to state
      socket.emit("setCurrentConversation", conversation);

      userView.chatInit(model.state);
      userView.addMessageFormListener(
        socket,
        model.state.currentUser.username,
        model.state.currentUser
      );

      //LOADING PREVIOUS MESSAGES
      const messages = await model.getRecentMessages(conversation._id, 1);
      userView.renderPreviousMessages(messages.mesages);
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

          // CREATING CONVERSATION
          const { conversation } = await model.createConversation(
            model.state.currentUser.userId,
            user.userId
          );

          //setting conversation to state
          model.state.conversation = conversation;
          socket.emit("setCurrentConversation", conversation);
          //HERE
          operatorView.addDotMenuListeners(
            model.deleteConversation,
            conversation,
            socket
          );

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
        //OPERATOR JOINING OPEN CONVERSATION
        operatorView.renderDatabaseConversations(conversations, socket);
      }
    });

    //STARTING OPENED CHAT FROM DB
    socket.on("startOpenedChat", async (conversation) => {
      //setting conversation to state
      socket.emit("setCurrentConversation", conversation);

      operatorView.addMessageFormListener(
        socket,
        conversation.userId.username,
        model.state.currentUser
      );
      operatorView.chatInit("", conversation.userId);

      //LOADING PREVIOUS MESSAGES
      const messages = await model.getRecentMessages(conversation._id, 1);
      operatorView.renderPreviousMessages(messages.mesages);
    });

    // RECEIVING MESSAGES
    socket.on("message", async (formatedMessage) => {
      operatorView.renderMessage(formatedMessage.msg, formatedMessage.from);

      // Emit to the server only if the current operator is the sender
      //Storing messages to database
      if (formatedMessage.from === model.state.currentUser.username) {
        socket.emit("sendMessageToServer", {
          msg: formatedMessage.msg,
          from: formatedMessage.from,
          conversation: model.state.conversation,
        });
      }
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
    operatorView.addLogoutBtnHandler(model.logoutUser);
    //GETTING SOCKET ID ON CONNECTION
    socket.on("socketConnected", (data) => {
      //SETTING SOCKETID PROPERTY ON CURRENT USER & SENDING USER BACK TO CLIENT
      currentUser.socketId = data;
      model.state.currentUser = currentUser;

      socket.emit("userJoin", currentUser);
    });
    //CALLING SPECIFIC PAGE CONTROLLERS
    userPageController(socket, currentUser);
    operatorPageController(socket, currentUser);

    socket.on("setStateConversation", (conversation) => {
      model.state.conversation = conversation;
      //HERE
      operatorView.addDotMenuListeners(
        model.deleteConversation,
        conversation,
        socket
      );
    });

    socket.on("message1", async (formatedMessage) => {
      socket.emit("sendMessageToServer", {
        msg: formatedMessage.msg,
        from: formatedMessage.from,
        conversation: model.state.conversation,
      });
    });

    socket.on("messageForDatabase", async (data) => {
      const { msg, from } = data;
      if ((msg, from)) {
        await model.createTextMessage(model.state.conversation._id, from, msg);
      }
    });

    //deleted conversation
    socket.on("closeClientConversation", (data) => {
      operatorView.reloadPage();
      userView.reloadPage();
    });
  }
};

const init = async () => {
  authController();
  socketController();
};

init();
