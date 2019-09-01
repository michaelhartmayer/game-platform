import { TinyEmitter } from "tiny-emitter";

const defaultSettings = {
  socket: null,
  namespace: '__ns__'
};

class CommunicationsManager extends TinyEmitter {  
  socket = null;
  namespace = null;

  get socket () {
    return this._socket;
  }

  constructor (settings = defaultSettings) {
    super();
    Object.assign(this, settings)
    this._startListeningToServer();
  }

  _startListeningToServer() {
    this.socket.on(this.namespace, (...args) => this.onMessage(...args));
  }

  _stopListeningToServer() {
    this.socket.off(this.onMessage);
  }

  onMessage(payload) {
    // ..
  }
}

export default CommunicationsManager;
