require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
//MORE PACKAGES
const cookieParser = require("cookie-parser");
//--server--
const server = http.createServer(app);
//DB
const connectDb = require("./db/connectDb");
//ROUTERS
const authRouter = require("./routes/authRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const adminRouter = require("./routes/adminRoutes");
const messageRouter = require("./routes/messageRoutes");
const navigationRouter = require("./routes/navigationRoutes");
//MIDDLEWARES
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
//IO
const io = socketio(server);
//APP
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/", navigationRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const {
  userJoin,
  userLeave,
  joinRoom,
  leaveRoom,
  getAllUsers,
  getUsersFromQueue,
} = require("./controllers/socketController");

const port = process.env.PORT || 5000;
const start = async () => {
  await connectDb(process.env.MONGO_URI);

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  io.on("connection", (socket) => {
    //SENDING SOCKET ID TO CLIENT
    socket.emit("socketConnected", socket.id);

    //RECIEVING CURRENT USER
    socket.on("userJoin", (user) => {
      userJoin(user);
      io.emit("updateQueue", getUsersFromQueue());

      if (user.role === "user") {
        //-check for existing chat(user reconection)
        socket.emit("checkExistingChat", user);

        joinRoom(socket, user.username, user);
      }
    });

    //LISTENING FOR EVENT SENT BY SELECT ELEMENT FROM CLIENT
    socket.on("requestQueueUpdate", () => {
      io.emit("updateQueue", getUsersFromQueue());
    });

    //operator joining chat
    socket.on("operatorJoin", ({ operator, user }) => {
      //  // Leave all rooms the operator is subscribed to
      leaveRoom(socket);
      joinRoom(socket, user.username, operator);
      io.to(user.username).emit("chatStart", { operator, user });
    });

    //removing user from queue on operator join
    socket.on("removeFromQueue", (user) => {
      userLeave(user.socketId);
      io.emit("updateQueue", getUsersFromQueue());
    });

    //recieving message from chat
    socket.on("chatMessage", (formatedMessage) => {
      io.to(formatedMessage.roomName).emit("message", formatedMessage);
    });

    socket.on("disconnect", () => {
      userLeave(socket.id);
      io.emit("updateQueue", getUsersFromQueue());
    });
  });
};

start();
