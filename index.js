const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var globalUsername
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("send-nickname", function (nickname) {
    socket.nickname = nickname;
    users.push(socket.nickname);
    console.log(users);
  });

  io.emit("user_login", "A new user has joined. Hi!");
  socket.on("chat message", (msg) => {
    console.log("message: " + `${globalUsername}: ${msg}`);
    io.emit("chat message", `${globalUsername}: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("user_login", "A user has left. Bye!");
  });

  socket.on("new user", (username) => {
    globalUsername = username
    console.log(`✋ ${username} has joined the chat! ✋`);
    //Save the username to socket as well. This is important for later.
    socket["username"] = username;
    //Send the username to all clients currently connected
    io.emit("new user", username);
  });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
