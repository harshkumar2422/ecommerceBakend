import app from "./app.js";
import cloudinary from "cloudinary";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
const port = process.env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // In-memory data for demonstration
  const allData = { products, users };
  io.to(socket.id).emit('get_all_data', allData);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

  
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

