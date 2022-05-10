import Bookshelf from "../db/bookshelf.js";

/*
CREATE TABLE IF NOT EXISTS public.truth
(
    id integer NOT NULL DEFAULT nextval('truths_id_seq'::regclass),
    text text COLLATE pg_catalog."default",
    CONSTRAINT truths_pkey PRIMARY KEY (id)
)
*/
const Truth = Bookshelf.Model.extend({
    tableName: 'truth',
    hasTimestamps: false
});

export default Truth;