import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Book = sequelize.define(
  'Book',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'books',
    timestamps: true,
    underscored: true,
  },
);

export default Book;
