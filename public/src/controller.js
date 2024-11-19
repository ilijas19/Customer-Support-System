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

    //-chat start
    socket.on("chatStart", ({ operator, user }) => {
      console.log(operator, "picked up your chat");
    });
  }
};

const operatorPageController = async (socket) => {
  if (window.location.pathname === "/operator") {
    // ON EACH USER JOIN, QUEUE IS UPDATED AND THERE IS A CLICK LISTENER ON ELEMENT
    socket.on("updateQueue", (users) => {
      // FIRST ARGUMENT IS USERS FROM QUEUE FROM SERVER AND SECOND IS HANDLER FUNCTION WHICH IS CALLED ON EACH CLICK ON PENDING CHAT ELEMENT
      operatorView.renderChatsAddListener(users, async (user) => {
        // - Start conversation with user
        // await model.createConversation(model.state.currentUser.userId, user.userId);

        // - operator Joins
        socket.emit("operatorJoin", {
          operator: model.state.currentUser,
          user,
        });
        // - Chat start
        socket.once("chatStart", ({ operator, user }) => {
          console.log(`You picked up chat with ${user.username}`);
          //adding form listener
          operatorView.addMessageFormListener(socket, user.username);
        });
      });
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
    //CALLING CONTROLLERS FOR BOTH PAGES
    userPageController(socket, currentUser);
    operatorPageController(socket, currentUser);
  }
};

const init = async () => {
  authController();
  socketController();
};

init();

// const socketController = async () => {
//   if (
//     window.location.pathname === "/operator" ||
//     window.location.pathname === "/userChat"
//   ) {
//     const socket = io();
//     const currentUser = await model.getCurrentUser();
//     //GETING SOCKETID FOR CONNECTED SOCKET
//     socket.on("socketConnected", (socketId) => {
//       //ADDING SOCKET ID PROPERTY TO CURRENT USER
//       currentUser.socketId = socketId;
//       userPageController(socket);
//       model.state.currentUser = currentUser;
//       //SENDING CURRENT USER BACK TO SERVER WITH SOCKET ID
//       socket.emit("userJoin", { currentUser });
//     });
//   }
// };
