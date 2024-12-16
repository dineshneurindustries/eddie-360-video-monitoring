const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming you're using a User model to fetch details from DB
const jwtSecret = require('../config/config');

const userConnections = new Map();
const adminConnections = new Map();

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (message) => {  // Use async function here
      try {
        const data = JSON.parse(message);

        if (data.token) {
          const user = jwt.verify(data.token, jwtSecret.jwt.secret);
          const userId = user.sub;

          if (data.role === 'admin') {
            adminConnections.set(userId, ws);
            ws.userId = userId;
            ws.role = 'admin';
            const userData = await User.findById(userId).exec();
            ws.name = userData.name;
            ws.email = userData.email;
            ws.send(JSON.stringify({ connectedUsers: Array.from(userConnections.keys()) }));
          } else if (data.role === 'user') {
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

            try {
              // Fetch user data from the database
              const userData = await User.findById(userId).exec(); // Use async/await to handle the promise

              if (userData) {
                // Send the user details (name and email) to the admin
                wss.clients.forEach((client) => {
                  if (client.readyState === WebSocket.OPEN && client.role === 'admin') {
                    client.send(JSON.stringify({
                      userId: userId,
                      name: userData.name,
                      email: userData.email,
                    }));
                  }
                });
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
            }
          }
        } else if (data.action) {
          const userId = ws.userId;
          if (!userId) return;

          if (data.role === 'admin') {
            // Admin sending control commands to a specific user
            const targetUserWs = userConnections.get(data.userId);
            if (targetUserWs && targetUserWs.readyState === WebSocket.OPEN) {
              targetUserWs.send(JSON.stringify({ action: data.action }));

              // Send the new video time to the admin
              targetUserWs.send(JSON.stringify({
                userStatus: data.action,
                userId: data.userId,
                videoTime: data.videoTime
              }));

              // Broadcast updated status to admin
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN && client.role === 'admin') {
                  client.send(JSON.stringify({
                    action: data.action, userId: data.userId, videoTime: data.videoTime
                  }));
                }
              });
            }
          }

          // Handling user actions (in case needed for logging or other purposes)
          else if (data.role === 'user') {
            // Send video time from user to admin
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN && client.role === 'admin') {
                client.send(JSON.stringify({
                  action: data.action,
                  userId: userId,
                  videoTime: data.videoTime
                }));
              }
            });

            // Broadcast updated video time from user to admin
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN && client.role === 'admin') {
                client.send(JSON.stringify({
                  action: data.action,
                  userId: userId,
                  videoTime: data.videoTime
                }));
              }
            });
          }
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ error: 'Invalid message or authentication failed' }));
      }
    });

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
