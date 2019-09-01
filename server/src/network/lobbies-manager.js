import log from "../utils/log";
import CommunicationsManager from "./communications-manager";
import Lobby from "./lobby";

const makeJoinLobby = lobby => {
  return {
    type: 'join-lobby',
    lobby: lobby.state
  };
};

const findLobbyById = (lobbies, id) => {
  return lobbies.find(lobby => lobby.id === id);
};

class LobbiesManager extends CommunicationsManager {
  _lobbies = [];

  emitLobbiesUpdate = user => {
    const lobbies = this._lobbies.map(lobby => lobby.state);

    user.socket.emit(this.namespace, {
      type: "lobbies-update",
      lobbies
    });
  };

  emitLobbiesUpdateToAllUsers = () => {
    this._users.forEach(this.emitLobbiesUpdate.bind(this));
  };

  emitJoinLobby = (user, lobby) => {
    user.socket.emit(this.namespace, makeJoinLobby(lobby));
  };

  handleLobbyAdd = lobby => ({ user }) => {
    this.emitLobbiesUpdateToAllUsers();
  };

  handleLobbyRemove = lobby => ({ user }) => {
    this.emitLobbiesUpdateToAllUsers();
  };

  handleLobbyEmpty = lobby => () => {
    this._lobbies = this._lobbies.filter(l => l !== lobby);
    this.emitLobbiesUpdateToAllUsers();
  };

  onMessage(user, payload) {
    const { type } = payload;

    switch (type) {
      case "lobby-update":
        this.emitLobbiesUpdate(user);
        break;

      case "create-lobby":
        const lobby = new Lobby(payload);
        lobby.add(user);
        
        this._lobbies.push(lobby);
        this.emitLobbiesUpdateToAllUsers();
        
        lobby.onEmpty(this.handleLobbyEmpty(lobby));
        lobby.onRemove(this.handleLobbyRemove(lobby));
        lobby.onAdd(this.handleLobbyAdd(lobby));
        
        this.emitJoinLobby(user, lobby);
        
        log("Creating Lobby for", user.alias.bold.white, user.id.yellow);
        break;

      case 'join-lobby':
        (() => {
          const lobby = findLobbyById(this._lobbies, payload.id);
          lobby.add(user);

          this.emitJoinLobby(user, lobby);
          this.emitLobbiesUpdateToAllUsers();

          log('Joining Lobby for', user.alias.bold.white, user.id.yellow, '->'.grey, lobby.title.green.bold);
        })();
        break;

      case "leave-lobby":
        break;

      case "set-lobby-title":
        break;

      case "set-lobby-game-mode":
        break;

      case "kick-user":
        break;

      case "invite-user":
        break;

      case "ban-user":
        break;

      case "pass-host":
        break;
    }
  }

  onRegistered(user) {
    this.emitLobbiesUpdate(user);
  }
}

export default LobbiesManager;
