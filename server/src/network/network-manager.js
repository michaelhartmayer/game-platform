class NetworkManager {
  _users = [];
  _namespace = "user-manager";
  _emitter = new TinyEmitter();

  get totalUsersOnline() {
    return this._users.length;
  }

  get on() {
    return this._emitter.on.bind(this._emitter);
  }

  _startListeningToUser(user) {
    user.socket.on(this._namespace, this._handleUserMessage);
  }

  _stopListeningToUser(user) {
    user.socket.off(this._namespace, this._handleUserMessage);
  }

  _handleUserMessage(payload) {
    // ..
  }

  register(user) {
    const { socket } = user;

    socket.on("disconnect", () => this.removeUser(user));
    this._emitter.emit("registered", { user });

    this._startListeningToUser(user);
  }

  removeUser(user) {
    this._users = this._users.filter(u => u !== user);
    this._emitter.emit("removed", { user });

    this._stopListeningToUser(user);
  }
}

export default NetworkManager;
