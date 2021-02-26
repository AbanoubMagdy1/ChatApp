const socket = io.connect('http://localhost:3000/');
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})

socket.emit("joinRoom", {username, room})

const chatContainer = document.querySelector(".chat-messages");
const usersContainer = document.getElementById("users");
const roomName = document.getElementById("room-name");
const chatForm = document.getElementById("chat-form");
const input = document.getElementById("msg");

roomName.textContent = room

socket.on("message", (msg) => {
    outputMessage(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
})

socket.on("users", users => {
    outputUsers(users)
})

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("message", input.value);
    input.value = "";
    input.focus();
})

function outputMessage(msg){
    chatContainer.innerHTML += `
    <div class="message ${msg.user === "You" ? "self" : ""}" >
        <p class="meta">${msg.user} <span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>
	</div>
    `
}

function outputUsers(users){
    usersContainer.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `
}