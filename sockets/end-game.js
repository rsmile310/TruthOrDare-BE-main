import room from "../controllers/room.js";
import { LOBBY_STATUS } from "../const.js";
import io from "../app.js";
const endGame = (socket) => {
    // Update room lobby status

    Promise.resolve(room.updateLobbyStatus(socket.roomId, LOBBY_STATUS.END))
    .then(updateRoom=>{
    
    // Send back updated room
    io.in(socket.roomId).emit('room-updated', updateRoom);
    })
    // 


}

export default endGame;