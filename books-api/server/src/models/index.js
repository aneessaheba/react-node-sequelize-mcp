import sequelize from '../config/database.js';
import Book from './book.model.js';

const db = {
  sequelize,
  Book,
};

export default db;
export { sequelize, Book };
