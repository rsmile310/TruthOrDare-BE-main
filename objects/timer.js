const timers = {};

class Timer{
    constructor(roomId){
        this.timeout;
        this.interval;
    }

    clear() {
        clearTimeout(this.timeout);
        clearInterval(this.interval);
    }
}

const setTimer = (timer, roomId, timeout, io, callback) => {
    let remaining = timeout;

    // round timeout
    timer.timeout = setTimeout(() => {
        timer.clear();
        callback();
    }, timeout * 1000);

    // round-timer
    timer.interval = setInterval(() => {
        remaining -= 1;

        io.in(roomId).emit('timer', remaining);

        if(remaining <= 0)
            clearInterval(timer.interval);
    }, 1000);
}

export {Timer, timers, setTimer};