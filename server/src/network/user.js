class User {
  _socket = null;
  _alias = 'Guest';

  get alias () {
    return this._alias;
  }

  get id () {
    return this._socket.id
  }

  get socket () {
    return this._socket;
  }

  get state () {
    return {
      alias: this.alias,
      id: this.id
    };
  }

  constructor ({ socket }) {
    this._socket = socket;
  }
}

export default User;
