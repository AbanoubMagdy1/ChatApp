const users = [];

function addUser(id, username, room){
    let user = {id, username, room};
    users.push(user);
    return user
}

function findUser(id){
    let user = users.find(user => user.id === id);
    if(user) return user
}

function userLeave(id){
    let idx = users.findIndex(user => user.id === id);
    if(idx > -1) return users.splice(idx, 1)[0];
}

function roomUsers(room){
    let roomUsers = users.filter(user => user.room === room)
    return roomUsers
}

module.exports = {addUser, findUser, userLeave, roomUsers}