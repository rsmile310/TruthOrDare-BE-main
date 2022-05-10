import knex from 'knex';
import bookshelf from 'bookshelf';
import config from './knexfile.js';
   
const Bookshelf = bookshelf(knex(config['production']));

export default Bookshelf;