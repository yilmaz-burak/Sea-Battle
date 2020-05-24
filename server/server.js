const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const game = require("./game");
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(__dirname + "/../client"));

let waitingPlayer = null;

server.on("error", (err)=>{
  console.error("server error : " + err);
});

io.on("connection", (socket)=>{
  if(waitingPlayer){
    // Game starts!
    io.emit("message", "Game is about to start");
    new game(waitingPlayer, socket);
    waitingPlayer = null;
  }

  else{
    // wait for a player
    waitingPlayer = socket;
    socket.emit("message", "Waiting for a player");
  }

  socket.on("message", (msg)=>{
    io.emit("message", msg);
  });

});

server.listen(process.env.PORT || 3000, ()=>{
  console.log("port is running");
});
