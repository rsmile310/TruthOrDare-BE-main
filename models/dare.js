import Bookshelf from "../db/bookshelf.js";

/*
CREATE TABLE IF NOT EXISTS public.dare
(
    id integer NOT NULL DEFAULT nextval('dares_id_seq'::regclass),
    text text COLLATE pg_catalog."default",
    CONSTRAINT dares_pkey PRIMARY KEY (id)
)
*/
const Dare = Bookshelf.Model.extend({
    tableName: 'dare',
    hasTimestamps: false
});

export default Dare;