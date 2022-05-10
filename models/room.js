import Bookshelf from "../db/bookshelf.js";

/*
CREATE TABLE IF NOT EXISTS public.room
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "ownerId" uuid,
    "currentPlayerId" uuid,
    "lobbyStatus" character varying(255) COLLATE pg_catalog."default",
    "gameStatus" character varying(255) COLLATE pg_catalog."default",
    "truthOrDare" character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT room_pkey PRIMARY KEY (id),
    CONSTRAINT room_currentplayerid_foreign FOREIGN KEY ("currentPlayerId")
        REFERENCES public.player (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_ownerid_foreign FOREIGN KEY ("ownerId")
        REFERENCES public.player (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
*/
const Room = Bookshelf.Model.extend({
    tableName: 'room',
    hasTimestamps: false
});

export default Room;