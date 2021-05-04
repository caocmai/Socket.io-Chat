const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var globalUsername
var onlineUsers = {}
io.on("connection", (socket) => {
  // console.log("a user connected");

  socket.on("send-nickname", function (nickname) {
    // console.log(nickname, "nickname")
    onlineUsers[nickname] = socket.id
    // socket.nickname = nickname;
    socket["username"] = nickname;
    // globalUsername = nickname
    // users.push(socket.nickname);
    // console.log(users);
    io.emit("send-nickname", nickname)
    io.emit("user_login", `${nickname} has joined. Hi!`);
    io.emit("online-users", onlineUsers)
  });

  
  io.emit("user_login", "Hi, WELCOME TO OUR CHAT");

  socket.on("chat message", (msg) => {
    // console.log("message: " + `${globalUsername}: ${msg}`);
    let username = socket.username
    console.log("chat user", username)
    io.emit("chat message", `${username}: ${msg}`);
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
    let username = socket.username
    delete onlineUsers[socket.username]
    io.emit("user_login", `${username} has left. Bye!`);
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
