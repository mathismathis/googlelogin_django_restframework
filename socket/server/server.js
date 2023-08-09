const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); // Import the cors package

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const activeRooms = new Map(); // Map to store room data: { roomId: { users: Set(), initiator: String } }

const corsOptions = {
  origin: 'http://localhost:3000', // Set the allowed origin to the frontend URL
};

app.use(cors(corsOptions));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId, userId) => {
    // Check if the user is already in any other room
    activeRooms.forEach((roomData, existingRoomId) => {
      if (roomData.users.has(userId)) {
        // Remove the user from the existing room
        socket.leave(existingRoomId);
        roomData.users.delete(userId);

        // Notify other users in the existing room that the user has left
        socket.to(existingRoomId).emit('userLeft', userId);
      }
    });

    // Check if the room exists; if not, create it
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, { users: new Set(), initiator: userId });
    }

    // Join the new room
    socket.join(roomId);
    activeRooms.get(roomId).users.add(userId);

    const initiator = activeRooms.get(roomId).initiator;
    const users = Array.from(activeRooms.get(roomId).users).filter((user) => user !== userId);

    // Notify the new user about the existing users in the room
    socket.emit('usersInRoom', users, initiator);

    // Notify other users that a new user has joined the room
    socket.to(roomId).emit('userJoined', userId);
  });

  socket.on('signalToPeer', ({ userId, callerId, signalData }) => {
    // Relay signal data to the target peer
    socket.to(userId).emit('signalToPeer', { userId: callerId, signalData });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    const roomData = activeRooms.get(roomId);
    if (roomData) {
      roomData.users.delete(socket.id);

      // Notify other users that the user has left the room
      socket.to(roomId).emit('userLeft', socket.id);
    }
  });

  socket.on('disconnect', () => {
    // Handle user disconnection and leave the rooms they were in
    activeRooms.forEach((roomData, roomId) => {
      if (roomData.users.has(socket.id)) {
        roomData.users.delete(socket.id);
        socket.to(roomId).emit('userLeft', socket.id);
      }
    });
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
