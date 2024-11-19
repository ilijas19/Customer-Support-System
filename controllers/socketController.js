let users = [];
let queue = [];
let rooms = [];

// Add a user to the system and queue if applicable
const userJoin = (user) => {
  users.push(user);
  if (user.role === "user") {
    queue.push(user);
  }
};

// Remove a user from the system and queue when they leave
const userLeave = (socketId) => {
  const user = users.find((user) => user.socketId === socketId);
  if (user) {
    users = users.filter((u) => u.socketId !== socketId);
    if (user.role === "user") {
      queue = queue.filter((u) => u.socketId !== socketId);
    }
  }
};

// Add a socket to a room
const joinRoom = (socket, roomName, user) => {
  user.room = roomName;
  socket.join(roomName);
  rooms.push({ socketId: socket.id, roomName });
  // console.log(`Socket ${socket.id} joined room: ${roomName}`);
  // console.log(user);
  // console.log(`--------------`);
};

// Remove a socket from a room
const leaveRoom = (socket, roomName, user) => {
  user.room = "";
  socket.leave(roomName);
  rooms = rooms.filter(
    (room) => room.socketId !== socket.id || room.roomName !== roomName
  );
  // console.log(`Socket ${socket.id} left room: ${roomName}`);
  // console.log(user);
  // console.log(`--------------`);
};

// Remove socket from all rooms
const leaveAllRooms = (socket) => {
  const roomsToLeave = rooms.filter((room) => room.socketId === socket.id);

  // Leave each room that the socket is currently in
  roomsToLeave.forEach((room) => {
    socket.leave(room.roomName);
    console.log(`Socket ${socket.id} left room: ${room.roomName}`);
  });

  // Remove the socket from the rooms array after leaving all rooms
  rooms = rooms.filter((room) => room.socketId !== socket.id);
};

// Get all users (for debugging or display purposes)
const getAllUsers = () => {
  console.log({ msg: "Online Users", users });
};

// Get all users in the queue
const getUsersFromQueue = () => queue;

// Find a user by their socket ID
const findUserBySocketId = (socketId) =>
  users.find((user) => user.socketId === socketId);

// Find a user by their username
const findUserByUsername = (username) =>
  users.find((user) => user.username === username);

module.exports = {
  userJoin,
  userLeave,
  getAllUsers,
  getUsersFromQueue,
  joinRoom,
  leaveRoom,
  leaveAllRooms,
  findUserBySocketId,
  findUserByUsername,
};

// let users = [];
// let queue = [];

// const userJoin = (user) => {
//   users.push(user);
//   if (user.role === "user") {
//     queue.push(user);
//   }
// };

// const userLeave = (socketId) => {
//   const user = users.find((user) => user.socketId === socketId);
//   users = users.filter((user) => user.socketId !== socketId);
//   if (user.role === "user") {
//     queue = queue.filter((user) => user.socketId !== socketId);
//   }
// };

// const getAllUsers = () => {
//   console.log({ msg: "Online Users", users });
// };

// const getUsersFromQueue = () => {
//   return queue;
// };
// module.exports = {
//   userJoin,
//   userLeave,
//   getAllUsers,
//   getUsersFromQueue,
// };

// getOnlyUserRole,
// getOnlyOperatorRole,
// findUserBySocketId,
// findUserByUsername,
// sendMessage,
// joinRoom,
// leaveRoom,
// showPendingChats,
// showOpenChats,
// showClosedChats,
