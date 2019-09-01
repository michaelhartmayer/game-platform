import "colors";
import socketio from "socket.io";
import log from "./utils/log";
import TinyEmitter from "tiny-emitter";

/**
 * SETTINGS
 */
const PORT = 3000;
const io = socketio();

class Lobby {
  _id = 0;
  _title = "Lobby";
  _users = [];
  _started = false;
  _emitter = null;

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get playerCount() {
    return this._users.length;
  }

  get on() {
    return this._emitter.on.bind(this._emitter);
  }

  constructor() {
    this._emitter = new TinyEmitter();
    this._id = 10000 + Math.floor(Math.random() * 90000);
  }

  addUser(user) {
    this._users.push(user);
    user.socket.on("disconnect", () => this.removeUser(user));
  }

  removeUser(user) {
    this._users = this._users.filter(lobbyUser => lobbyUser !== user);
    if (this._users.length === 0) this._emitter.emit("empty");
    this._emitter.emit("update");
  }
}

class User {
  _alias = "Guest#0000";
  _socket = null;

  get alias() {
    return this._alias;
  }
  get socket() {
    return this._socket;
  }

  constructor({ socket, alias }) {
    this._alias = `Guest#` + (1000 + Math.floor(Math.random() * 9000));
    this._socket = socket;
  }
}

let onlineUsers = [];
let lobbies = [];

const emitOnlineTo = onlineUsers => {
  const allOnlineUsers = onlineUsers.map(user => ({
    alias: user.alias,
    id: user.socket.id
  }));

  onlineUsers.forEach(user => {
    user.socket.emit("whoisOnline", { allOnlineUsers });
  });
};

const emitLobbiesTo = (users, lobbies) => {
  const allLobbies = lobbies.map(lobby => {
    return {
      title: lobby.title,
      id: lobby.id,
      playerCount: lobby.playerCount
    };
  });

  users.forEach(user => user.socket.emit("updateLobbies", { allLobbies }));
};

const getUserFromSocket = socket => users.find(user => user.socket === socket);
const getLobbyFromId = id => lobbies.find(lobby => lobby.id === id);

// watch for incoming socket.io connections
io.on("connection", socket => {
  // create a user
  const user = new User({ socket });

  /* Socket: Disconnect */
  socket.on("disconnect", () => {
    log("Disconnected:", user.socket.id, user.alias);

    onlineUsers = onlineUsers.filter(onlineUser => onlineUser !== user);

    emitOnlineTo(onlineUsers);
  });

  /* Socket: Create Game */
  socket.on("createLobby", () => {
    const lobby = new Lobby();
    lobby.addUser(user);
    lobbies.push(lobby);

    lobby.on("update", () => {
      if (lobby.playerCount === 0)
        lobbies = lobbies.filter(existingLobby => existingLobby !== lobby);
      emitLobbiesTo(onlineUsers, lobbies);
    });

    user.socket.emit("lobbyJoined", {
      playerCount: lobby.playerCount,
      title: lobby.title,
      id: lobby.id
    });

    emitLobbiesTo(onlineUsers, lobbies);
  });

  /* Socket: Start Game */
  socket.on('startGame', ({ id }) => {
    log('Start Game in Lobby #', id);
  });

  /* Socket: Join Lobby */
  socket.on("joinLobby", ({ id }) => {
    const lobby = getLobbyFromId(id);

    lobby.addUser(user);
    emitLobbiesTo(onlineUsers, lobbies);

    user.socket.emit("lobbyJoined", {
      playerCount: lobby.playerCount,
      title: lobby.title,
      id: lobby.id
    });

    log("Join Lobby:", user.alias, "to lobby", lobby.id);
  });

  /* Socket: Identify Player */
  io.emit("ident", { alias: user.alias });

  // store user as online
  onlineUsers.push(user);

  emitOnlineTo(onlineUsers);
  emitLobbiesTo([user], lobbies);
});

io.listen(PORT);
log(`Listening on port: ${PORT}`);
