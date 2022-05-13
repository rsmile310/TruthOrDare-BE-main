import room from "../controllers/room.js";
import player from "../controllers/player.js";
import {
  GAME_STATUS,
  LOBBY_STATUS,
  MAX_PLAYERS,
  PLAYER_STATUS,
} from "../const.js";
import io from "../app.js";
import room_dare from "../controllers/room_dare.js";
import room_truth from "../controllers/room_truth.js";

const joinRoom = (socket, { roomId, name, avatar }) => {
  console.log("join room " + roomId);
  // Add roomId to socket object
  socket.roomId = roomId;
  socket.join(roomId);

  console.log(socket.handshake.session.userdata);

  if (!socket.handshake.session.userdata) {
    socket.handshake.session.userdata = {};
  }

  if (!socket.handshake.session.userdata[roomId]) {
    socket.handshake.session.userdata[roomId] = socket.id;
    socket.handshake.session.save();
  }

  console.log("old " + socket.handshake.session.userdata[roomId]);
  console.log("new " + socket.id);
  console.log("roomid " + roomId);

  Promise.all([
    player.getNumPlayersInRoom(roomId),
    player.getPlayerBySocketId(
      socket.handshake.session.userdata[roomId],
      roomId
    ),
    // does the room still exist (room might close when user enters name)
    room.getById(roomId),
  ])
    .then((res) => {
      let numPlayers = res[0];

      console.log(res[0]);
      if (res[0] >= MAX_PLAYERS) {
        socket.emit("room-error", "Room Full");
        return;
      } else {
        //Check to see if a player with the given cookie socket ID exists
        //console.log("I'm looking for you with socket id: " + socket.handshake.session.userdata);
        if (Array.from(res[1]).length == 0) {
          console.log("couldn't find so now I'm inserting you");

          //insert the new player
          Promise.resolve(
            player.insert({
              socketId: socket.id,
              truthScore: 0,
              dareScore: 0,
              playerStatus: PLAYER_STATUS.READY,
              roomId: roomId,
              name: name,
              avatar: avatar,
            })
          ).then((res) => {
            let ops = [];
            if (numPlayers == 0) {
              ops.push(room.updateHostPlayer(roomId, res));
            }

            Promise.all(ops).then((res) => {
              Promise.all([
                room.getById(roomId),
                player.getPlayersinRoom(roomId),
              ]).then((res) => {
                io.in(roomId).emit("players-updated", res[1]);
                io.in(roomId).emit("room-updated", res[0]);
              });
            });
          });
        } else {
          console.log("I found you, so I'll just update your socket id");

          //Update cookie sockwr id to current socket id bc player exists.
          Promise.resolve(
            player.updateSocketId(
              socket.handshake.session.userdata[roomId],
              socket.id
            )
          ).then((res) => {
            socket.handshake.session.userdata[roomId] = socket.id;
            socket.handshake.session.save();

            // Update player status before we get all the players
            Promise.resolve(
              player.setPlayerStatus(socket.id, roomId, PLAYER_STATUS.READY)
            ).then((res) => {
              Promise.all([
                player.getPlayersinRoom(roomId),
                room.getById(roomId),
              ]).then((res) => {
                io.in(roomId).emit("players-updated", res[0]);
                io.in(roomId).emit("room-updated", res[1]);

                let ops = [];
                // update the player on where we are in the game
                if (res[1].lobbyStatus === LOBBY_STATUS.GAME) {
                  switch (res[1].gameStatus) {
                    case GAME_STATUS.ACTION_VOTE:
                      if (res[1].truthOrDare == "truth") {
                        ops.push(room_truth.getVotableTruths(roomId));
                      } else {
                        ops.push(room_dare.getVotableDares(roomId));
                      }

                      Promise.all(ops).then((res) => {
                        console.log(res);
                        socket.emit("action-selection", res[0]);
                        // socket.emit("tord-selection", res[1].truthOrDare);
                      });

                      break;
                    case GAME_STATUS.PERFORMING_ACTION:
                      if (res[1].truthOrDare == "truth") {
                        ops.push(room_truth.getTruthInPlay(roomId));
                      } else {
                        ops.push(room_dare.getDareInPlay(roomId));
                      }
                      Promise.all(ops).then((res) => {
                        console.log(res[0]);
                        socket.emit("action-reveal", res[0]);
                      });

                      break;
                  }
                }
              });
            });
          });
        }
      }
    })
    .catch((err) => {
      console.log("room no longer exists!");
      socket.emit("room-error", "Room does not exist!");
    });
};

export default joinRoom;
