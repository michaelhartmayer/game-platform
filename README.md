# Card Game Server 0.1

## The Server
  - All Users
    * Socket
    * State
  - All Lobbies
    * Title
    * Cur / Max Players
    * Mode
    * Host
    * Seat Types ?
  - All Games
    * Loading
    * Gameplay
    * Outro
    * Spectate ?
  - All Messages
    * PMs
    * Chat Rooms
    * Friend Requests
  - Friends
    * Online / Offline
    * Game Status
    * Block / Unblock
    * Invite
    * Remove
    * Blast

## Abstractions
  - User
    * Unique Session ID
    - Profile
      * Alias
      * Avatar
  - Game
  - Lobby
    * Title
    * Game Mode
    * Host
    * Seats
      - Seat
        * Type
  - Message

## Process
  - Socket
  - User
  - User -> Lobbies
  - Lobbies -> Games
  &
  - Messages Happen
