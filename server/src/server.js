import "colors";
import socketio from "socket.io";
import log from "./utils/log";
import TinyEmitter from "tiny-emitter";

import User from "./network/user";
import UserManager from "./network/user-manager";
import FriendsManager from './network/friends-manager';
import LobbiesManager from './network/lobbies-manager';
import GamesManager from './network/games-manager';
import MessagesManager from './network/messages-manager';

/**
 * SETTINGS
 */
const PORT = 3000;
const io = socketio();

const managers = [
  new UserManager({ namespace: 'user-manager' }),
  // new FriendsManager(),
  new LobbiesManager({ namespace: 'lobbies-manager' }),
  // new GamesManager(),
  // new MessagesManager()
];

const registerManagerWithUser = user => manager => manager.register(user);

io.on("connection", socket => {
  const user = new User({ socket });
  managers.forEach(registerManagerWithUser(user));
});

io.listen(PORT);
log(`Listening on port: ${PORT}`);
