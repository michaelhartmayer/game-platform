import CommunicationsManager from "./communications-manager";

class UserManager extends CommunicationsManager {
  onMessage(payload) {
    const { type, ...rest } = payload;
    this.emit(type, rest);
  }

  onServerPopulationUpdate(handler) {
    this.on("server-population-update", handler);
  }

  onUserIdentUpdate(handler) {
    this.on("user-ident-update", handler);
  }
}

export default UserManager;
