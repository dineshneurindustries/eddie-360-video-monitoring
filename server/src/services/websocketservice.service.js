const { Server } = require('socket.io');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtSecret = require('../config/config');

// Map to keep track of users and their devices
const userConnections = new Map();
const adminConnections = new Map();

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        if (data.token) {
          // Authenticate the user
          const user = jwt.verify(data.token, jwtSecret.jwt.secret);
          const userId = user.sub;

          if (data.role === 'admin') {
            // Admin connection handling
            adminConnections.set(userId, ws);
            ws.userId = userId;
            ws.role = 'admin';
            console.log(`Authenticated admin: ${userId}`);
          } else if (data.role === 'user') {
            // User connection handling
            if (userConnections.has(userId)) {
              const previousWs = userConnections.get(userId);
              if (previousWs && previousWs.readyState === WebSocket.OPEN) {
                previousWs.send(JSON.stringify({ error: 'Another device connected. You have been logged out.' }));
                previousWs.close();
              }
            }
            userConnections.set(userId, ws);
            ws.userId = userId;
            ws.role = 'user';
            console.log(`Authenticated user: ${userId}`);
          }
        } else if (data.action) {
          // Broadcast play/pause actions to all clients except the sender
          const userId = ws.userId;
          if (!userId) return; // Ignore unauthenticated users

          if (data.role === 'admin') {
            // Send play/pause action from admin to user
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN && client.role === 'user') {
                client.send(JSON.stringify({ action: data.action, videoTime: data.videoTime }));
              }
            });
          } else if (data.role === 'user') {
            // Send play/pause action from user to admin
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN && client.role === 'admin') {
                client.send(JSON.stringify({ action: data.action, videoTime: data.videoTime }));
              }
            });
          }

          // Handle the timer synchronization
          if (data.timer) {
            // Send the updated timer value to both the user and admin
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ timer: data.timer }));
              }
            });
          }
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ error: 'Invalid message or authentication failed' }));
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (ws.userId) {
        if (ws.role === 'admin') {
          adminConnections.delete(ws.userId);
        } else if (ws.role === 'user') {
          userConnections.delete(ws.userId);
        }
      }
    });
  });

  console.log('WebSocket server started');
};

module.exports = initWebSocket;
