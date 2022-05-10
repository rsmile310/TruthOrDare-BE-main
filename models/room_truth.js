import Bookshelf from "../db/bookshelf.js";

/*
CREATE TABLE IF NOT EXISTS public.room_truth
(
    "roomId" character varying(255) COLLATE pg_catalog."default",
    "truthId" integer,
    "numberOfVotes" integer DEFAULT 0,
    "isVotable" boolean DEFAULT false,
    "isInPlay" boolean DEFAULT false,
    id uuid NOT NULL,
    CONSTRAINT room_truth_pkey PRIMARY KEY (id),
    CONSTRAINT room_truth_roomid_foreign FOREIGN KEY ("roomId")
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_truth_truthid_foreign FOREIGN KEY ("truthId")
        REFERENCES public.truth (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
*/
const Room_Truth = Bookshelf.Model.extend({
    tableName: 'room_truth',
    hasTimestamps: false
});

export default Room_Truth;