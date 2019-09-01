import './Lobby.styl';
import React from 'react';

class Lobby extends React.Component {
  render() {
    return (
      <div className='lobby'>
        <h1>
          {this.props.title}#{this.props.id}
        </h1>
        <p>
          Players: ({this.props.seats.length}/{this.props.maxSeats})
        </p>

        <ul>
          {this.props.seats.map((user, i) => {
            return (
              <li key={i}>
                {user.alias}#{user.id}
              </li>
            );
          })}
        </ul>

        <button onClick={this.props.onStartGame}>Start Game</button>
      </div>
    );
  }
}

export default Lobby;
