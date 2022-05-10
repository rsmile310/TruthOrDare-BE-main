import room from '../controllers/room.js';
import player from '../controllers/player.js';
import room_truth from '../controllers/room_truth.js';
import room_dare from '../controllers/room_dare.js';
import truth from '../controllers/truth.js';
import dare from '../controllers/dare.js';
import {timers, Timer, setTimer} from '../objects/timer.js'
import { GAME_STATUS } from '../const.js';
import io from '../app.js';


const actionPerformed = (socket) => {

    console.log("ACTION PERFORMED! " + socket.roomId);
    let ops1=[];
    ops1.push(room.getById(socket.roomId));
    ops1.push(room_truth.getTruthInPlayNotQuery(socket.roomId));
    ops1.push(room_dare.getDareInPlayNotQuery(socket.roomId));

  
   
    Promise.resolve(ops1[0])
    .then(roomRes=>{
        var tOd = roomRes.truthOrDare;
        let ops=[];
        // Update game status (rating)
        
        ops.push(room.updateGameStatus(socket.roomId, GAME_STATUS.RATING));
        // Delete the room_truth/dare that we just played
       if(tOd=='truth')
       ops.push(ops1[1]);
       else
       ops.push(ops1[2]);

       Promise.all(ops)
       .then(GetCurrentInPlay=>{
           console.log("return current");
           console.log(GetCurrentInPlay[1]);
        if(tOd == 'truth')
        ops.push(room_truth.deleteSingle(socket.roomId, GetCurrentInPlay[1].truthId));
        else
        ops.push(room_dare.deleteSingle(socket.roomId, GetCurrentInPlay[1].dareId));

        Promise.all(ops)
        .then(result=>{
            Promise.resolve(room.getById(socket.roomId))
            .then(updatedRoom=>{
                console.log("finsihed!!");
                console.log(updatedRoom);
                io.in(socket.roomId).emit('room-updated', updatedRoom);
                
            })
        })
       })
    })
    .catch(err=>{
        console.log("error");//
        console.log ( err);
    })
    
    

    
    // Send back updated room
}

export default actionPerformed;