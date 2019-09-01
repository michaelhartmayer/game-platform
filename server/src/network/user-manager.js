import CommunicationsManager from "./communications-manager";
import log from "../utils/log";

const makeServerPopulationUpdate = users => ({
  type: "server-population-update",
  serverPopulation: users.map(user => ({
    alias: user.alias,
    id: user.id
  }))
});

const makeUserIdentUpdate = user => ({
  type: 'user-ident-update',
  user: {
    id: user.id,
    alias: user.alias
  }
});

class UserManager extends CommunicationsManager {
  emitServerPopulationUpdate = user => {
    user.socket.emit(this.namespace, makeServerPopulationUpdate(this.users));
  };

  emitUserIdentUpdate = user => {
    user.socket.emit(this.namespace, makeUserIdentUpdate(user));
  };

  onMessage(user, payload) {
    const { type } = payload;

    switch (type) {
      case "server-population-update":
        this.emitServerPopulationUpdate(user);
        break;

      case "user-ident-update":
        this.emitUserIdentUpdate(user);
        break;
    }
  }

  onRegistered(user) {
    this.users.forEach(this.emitServerPopulationUpdate);
    this.emitUserIdentUpdate(user);
  }

  onRemoved(user) {
    this.users.forEach(this.emitServerPopulationUpdate);
  }
}

export default UserManager;
