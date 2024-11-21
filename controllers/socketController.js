let users = [];
let queue = [];

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
  // rooms.push({ socketId: socket.id, roomName });
  // console.log(rooms);
};

// Remove a socket from a room
const leaveRoom = (socket) => {
  const rooms = Array.from(socket.rooms);
  rooms.forEach((room) => {
    if (room !== socket.id) {
      // Prevent operator from leaving their default room
      socket.leave(room);
    }
  });
};

// Get all users (for debugging or display purposes)
const getAllUsers = () => {
  console.log({ msg: "Online Users", users });
};

// Get all users in the queue
const getUsersFromQueue = () => queue;

module.exports = {
  userJoin,
  userLeave,
  joinRoom,
  leaveRoom,
  getAllUsers,
  getUsersFromQueue,
};
