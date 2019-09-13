import "./app.styl";
import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import UserManager from "./network/user-manager";
import LobbiesManager from "./network/lobbies-manager";
import Lobby from "./components/Lobby";
import Card from "./components/Card";

const SERVER_ADDR =
  process.env.SERVER_ADDR || "http://" + window.location.hostname + ":3000";

const el = document.querySelector("#app");

const Screens = {
  MainMenu: 1,
  Lobby: 2,
  Loading: 3,
  InGame: 4,
  Score: 5
};

const findLobbyById = (lobbies, id) => lobbies.find(lobby => lobby.id === id);

class App extends React.Component {
  state = {
    screen: Screens.MainMenu,
    connected: false,
    user: {
      alias: "",
      id: 0
    },
    lobby: 0,
    lobbies: [],
    serverPopulation: [],
    game: {
      deck: {
        totalCards: 0,
        currentCards: 0
      },
      hand: [],
      history: [],
      players: []
    }
  };

  handleJoinLobby = ({ lobby }) => {
    this.setState({
      lobby: lobby.id,
      screen: Screens.Lobby
    });
  };

  componentDidMount() {
    const socket = io(SERVER_ADDR);

    // connect | disconnect
    socket.on("connect", () => this.setState({ connected: true }));
    socket.on("disconnect", () => this.setState({ connected: false }));
    socket.on("error", () => alert("error"));

    // user manager
    const userManager = new UserManager({ socket, namespace: "user-manager" });
    userManager.onUserIdentUpdate(this.setState.bind(this));
    userManager.onServerPopulationUpdate(this.setState.bind(this));

    // lobbies manager
    const lobbyManager = new LobbiesManager({
      socket,
      namespace: "lobbies-manager"
    });

    lobbyManager.onLobbiesUpdate(this.setState.bind(this));
    lobbyManager.onJoinLobby(this.handleJoinLobby);

    // ref
    this._socket = socket;
    this._lobbyManager = lobbyManager;
  }

  renderAllOnlineUsers() {
    const { serverPopulation } = this.state;

    return serverPopulation.map(({ alias, id }, i) => {
      return (
        <li key={`user-${i}`}>
          <b>Alias</b>: {alias} ({id})
        </li>
      );
    });
  }

  renderLobbies() {
    return this.state.lobbies.map(({ title, id, playerCount }, i) => {
      return (
        <li key={`user-${i}`}>
          <b>{title}</b>#{id} - ({playerCount}) -
          <button onClick={this._lobbyManager.join(id)}>Join</button>
        </li>
      );
    });
  }

  renderLobby() {
    return (
      <Lobby
        {...findLobbyById(this.state.lobbies, this.state.lobby)}
        onStartGame={this.handleStartGame}
      />
    );
  }

  renderMainMenu() {
    return (
      <div>
        <div>
          <button onClick={() => this._lobbyManager.createLobby()}>
            Create Game
          </button>
        </div>
        <div>
          <h2>Users Online</h2>
          <ul>
            {this.state.serverPopulation.map((user, i) => {
              return (
                <li key={i}>
                  <b>{user.alias}</b>#{user.id} <button>Let's Play!</button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2>Lobbies</h2>
          <ul>
            {this.state.lobbies.map((lobby, i) => {
              return (
                <li key={i}>
                  {lobby.title} ({lobby.seats.length} / {lobby.maxSeats}){" "}
                  <button
                    onClick={() => this._lobbyManager.joinLobby(lobby.id)}
                  >
                    Join
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  renderScreen() {
    switch (this.state.screen) {
      case Screens.Lobby:
        return this.renderLobby();

      case Screens.MainMenu:
      default:
        return this.renderMainMenu();
    }
  }

  render() {
    const { connected, serverPopulation, user } = this.state;

    return (
      <div>
        <Card visible />
        <div>
          <h1 className="type1">Game Platform: Client</h1>
          Welcome, <b>{user.alias}</b>#<i>{user.id}</i>
          <p>
            Connection: {connected ? "Online" : "Offline"} <br />
            Total Users Online: {serverPopulation.length}
          </p>
        </div>

        {this.renderScreen()}
      </div>
    );
  }
}

ReactDOM.render(<App />, el);
