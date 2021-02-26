const express = require("express");
const PORT = process.env.PORT || 3000;
const socket = require("socket.io");
const path = require("path");
const formatMessage = require("./utils/message");
const {addUser, findUser, userLeave, roomUsers} = require("./utils/users")

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})

const io = socket(server);
const botName = "Chatcord bot"

io.on("connection", socket => {
    socket.on("joinRoom", ({username, room}) => {
        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        let roomUserz = roomUsers(user.room);
        io.to(user.room).emit("users", roomUserz)
        socket.emit("message", formatMessage(botName, `Welcome ${user.username} to the chatcord`))
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
    
    })

    socket.on("message", msg => {
        const user = findUser(socket.id);
        socket.emit("message", formatMessage("You", msg))
        socket.broadcast.to(user.room).emit("message", formatMessage(user.username, msg))
    })

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`))
        let roomUserz = roomUsers(user.room);
        io.to(user.room).emit("users", roomUserz)
    })
})