const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  // console.log("a user connected");
  io.emit("user_login", "A new user has joined. Hi!")
  socket.on("chat message", (msg) => {
    console.log('message: ' + msg);
    io.emit("chat message", msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
      io.emit("user_login", "A user has left. Bye!")
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
