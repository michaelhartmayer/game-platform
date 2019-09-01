import CommunicationsManager from "./communications-manager";

const defaultLobbySettings = {
  title: "Untitled Lobby",
  gameMode: 0,
  maxSeats: 8,
  host: "",
  seats: []
};

const makeCreateLobby = settings => {
  return {
    type: 'create-lobby',
    ...settings
  };
};

const makeJoinLobby = id => {
  return {
    type: 'join-lobby',
    id
  };
};

const makeLeaveLobby = () => ({
  type: 'leave-lobby'
});

class LobbiesManager extends CommunicationsManager {
  onMessage(payload) {
    const { type, ...rest } = payload;
    this.emit(type, rest);
  }

  onLobbiesUpdate(handler) {
    this.on("lobbies-update", handler);
  }

  onJoinLobby(handler) {
    this.on('join-lobby', handler);
  }

  createLobby(lobbySettings = defaultLobbySettings) {
    const settings = { ...defaultLobbySettings, ...lobbySettings };
    this.socket.emit(this.namespace, makeCreateLobby(settings));
  }

  leaveLobby() {
    this.socket.emit(this.namespace, makeLeaveLobby());
  }

  joinLobby(id) {
    console.log('joining..')
    this.socket.emit(this.namespace, makeJoinLobby(id));
  }
}

export default LobbiesManager;
