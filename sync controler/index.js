import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
app.use(express.json());
dotenv.config();
app.use(cors());

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("set_duration", (data) => {
    socket.broadcast.emit("get_duration", data);
  });
  socket.on("set_url", (data) => {
    socket.broadcast.emit("get_url", data);
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("SERVER IS RUNNING");
});
