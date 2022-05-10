import Bookshelf from "../db/bookshelf.js";

/*
CREATE TABLE IF NOT EXISTS public.player
(
    id uuid NOT NULL,
    "socketId" character varying(255) COLLATE pg_catalog."default",
    "truthScore" integer,
    "dareScore" integer,
    "playerStatus" character varying(255) COLLATE pg_catalog."default",
    "roomId" character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    "hasPlayed" boolean DEFAULT false,
    "hasVoted" boolean DEFAULT false,
    avatar character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT player_pkey PRIMARY KEY (id),
    CONSTRAINT player_roomid_foreign FOREIGN KEY ("roomId")
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
*/
const Player = Bookshelf.Model.extend({
    tableName: 'player',
    hasTimestamps: false
});

export default Player;