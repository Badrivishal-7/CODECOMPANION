const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (if you need to serve the front-end as well)
app.use(express.static('public'));

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Room management (to manage users joining rooms)
let rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on('join-room', (roomId) => {
    console.log(`${socket.id} joined room: ${roomId}`);
    socket.join(roomId);

    // Emit an event to all users in the room that a new user has joined
    socket.to(roomId).emit('user-joined', socket.id);

    // Store room info (you can store more data if needed)
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket.id);

    // Notify the new user who joined the room (optional)
    socket.emit('joined-room', roomId);
  });

  // Handle signal exchange (for WebRTC)
  socket.on('signal', (data) => {
    // Forward the signal data to the user in the same room
    socket.to(data.roomId).emit('signal', {
      userId: socket.id,
      signalData: data.signalData,
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the user from rooms
    for (let roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});
