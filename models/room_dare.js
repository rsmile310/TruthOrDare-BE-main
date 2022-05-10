import Bookshelf from "../db/bookshelf.js";

/*
CREATE TABLE IF NOT EXISTS public.room_dare
(
    "roomId" character varying(255) COLLATE pg_catalog."default",
    "dareId" integer,
    "numberOfVotes" integer DEFAULT 0,
    "isVotable" boolean DEFAULT false,
    "isInPlay" boolean DEFAULT false,
    id uuid NOT NULL,
    CONSTRAINT room_dare_pkey PRIMARY KEY (id),
    CONSTRAINT room_dare_dareid_foreign FOREIGN KEY ("dareId")
        REFERENCES public.dare (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_dare_roomid_foreign FOREIGN KEY ("roomId")
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
*/
const Room_Dare = Bookshelf.Model.extend({
    tableName: 'room_dare',
    hasTimestamps: false
});

export default Room_Dare;