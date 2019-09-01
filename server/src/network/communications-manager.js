import { TinyEmitter } from "tiny-emitter";

const defaultSettings = {
  namespace: '__ns__'
};

class CommunicationsManager extends TinyEmitter {
  namespace = null;
  _users = [];

  get users () {
    return this._users;
  }

  constructor (settings = defaultSettings) {
    super();
    Object.assign(this, settings);
  }

  _startListeningToUser(user) {
    user.socket.on("disconnect", () => this.removeUser(user));
    user.socket.on(this.namespace, payload => this.onMessage(user, payload));
  }

  _stopListeningToUser(user) {
    user.socket.off(this.namespace, payload => this.onMessage(user, payload));
  }

  onMessage(payload) {
    // ..
  }

  onRegistered(user) {
    // ..
  }

  onRemoved(user) {
    // ..
  }

  register(user) {
    this._users.push(user);
    this._startListeningToUser(user);
    this.onRegistered(user);
  }

  removeUser(user) {
    this._users = this._users.filter(u => u !== user);
    this._stopListeningToUser(user);
    this.onRemoved(user);
  }
}

export default CommunicationsManager;
