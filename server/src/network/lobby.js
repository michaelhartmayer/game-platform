import { TinyEmitter } from "tiny-emitter";

class Lobby extends TinyEmitter {
  _id = 0;

  title = "";
  gameMode = 0;
  maxSeats = 8;
  host = "";
  seats = [];

  get id () {
    return this._id;
  }

  // @todo - dont like this idea
  get state() {
    const { title, gameMode, maxSeats, host, seats, id } = this;
    return { 
      id,
      title, 
      gameMode, 
      maxSeats, 
      host: host.state, 
      seats: seats.map(user => user.state),
    };
  }

  constructor(settings) {
    super();
    Object.assign(this, settings);
    this._id = 10000 + Math.floor((Math.random() * 90000));
  }

  add(user) {
    this.seats.push(user);
    this.emit("user-added", { user });

    user.socket.on('disconnect', () => this.remove(user));
  }

  remove(user) {
    this.seats = this.seats.filter(u => u !== user);
    this.emit("user-removed", { user });

    if (this.seats.length === 0) {
      this.emit("empty");
    }
  }

  onEmpty(handler) {
    this.on("empty", handler);
  }

  onAdd(handler) {
    this.on("user-added", handler);
  }

  onRemove(handler) {
    this.on("user-removed", handler);
  }
}

export default Lobby;
