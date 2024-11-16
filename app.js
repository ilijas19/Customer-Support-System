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
//MIDDLEWARES
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
//IO
const io = socketio(server);
//APP
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  await connectDb(process.env.MONGO_URI);

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
