const MAX_PLAYERS = 8;

const LOBBY_STATUS = {
    LOBBY: "LOBBY",
    GAME: "GAME",
    END: "END"
}

const PLAYER_STATUS = {
    READY: "READY",
    DISCONNECTED: "DISCONNECTED",
    IN_CAPTURE_MOMENT: "IN_CAPTURE_MOMENT"
}

const GAME_STATUS = {
    // spinny wheel
    CHOOSING_PLAYER: "CHOOSING_PLAYER",
    // current player picking truth or dare,
    CHOOSING_TORD: "CHOOSING_TORD",
    // players picking which truth/dare to do
    ACTION_VOTE: "ACTION_VOTE",
    // current player is acting out the truth or dare
    PERFORMING_ACTION: "PERFORMING_ACTION",
    // other players are rating the performed action
    RATING: "RATING",
    // current player picking next round or end game
    ROUND_END: "ROUND_END"
}

export {MAX_PLAYERS, LOBBY_STATUS, PLAYER_STATUS, GAME_STATUS}