import room_truth from '../controllers/room_truth.js'
import room_dare from '../controllers/room_dare.js'
import room from '../controllers/room.js'
import {timers, Timer, setTimer} from '../objects/timer.js'
import { GAME_STATUS } from '../const.js'
import io from '../app.js'

const truthOrDareSelected = (socket, truthOrDare) => {
    let ops = [];

    if(truthOrDare == 'truth'){
        ops.push(room_truth.getRandomTruths(socket.roomId))
    }else{
        ops.push(room_dare.getRandomDares(socket.roomId))
    }

    ops.push(room.updateGameStatus(socket.roomId, GAME_STATUS.ACTION_VOTE))
    ops.push(room.updateTruthOrDare(socket.roomId, truthOrDare))

    Promise.all(ops)
    .then(res => {
        io.in(socket.roomId).emit('action-selection', res[0]);
        io.in(socket.roomId).emit('room-updated', res[1]);

        // start a new timer
        let timer = new Timer()
        timers[socket.roomId] = timer;
        setTimer(timer, socket.roomId, 100000, io, () => {
            // If we have reached here then none have been chosen, select random
            timers[socket.roomId] = {};

            Promise.all([
                room.updateGameStatus(socket.roomId, GAME_STATUS.PERFORMING_ACTION),
            ])
            .then(res => {
                io.in(socket.roomId).emit('room-updated', res[0]);
            })
        });
    })
}

export default truthOrDareSelected;