import { Book } from '../models/index.js';

const validatePayload = (title, author) => {
  const sanitizedTitle = typeof title === 'string' ? title.trim() : '';
  const sanitizedAuthor = typeof author === 'string' ? author.trim() : '';

  if (!sanitizedTitle || !sanitizedAuthor) {
    return { isValid: false, message: 'Both title and author are required.' };
  }

  return { isValid: true, sanitizedTitle, sanitizedAuthor };
};

export const createBook = async (req, res, next) => {
  try {
    const { title, author } = req.body;
    const { isValid, sanitizedTitle, sanitizedAuthor, message } = validatePayload(title, author);

    if (!isValid) {
      return res.status(400).json({ message });
    }

    const book = await Book.create({ title: sanitizedTitle, author: sanitizedAuthor });
    return res.status(201).json(book);
  } catch (error) {
    return next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll({ order: [['id', 'ASC']] });
    return res.json(books);
  } catch (error) {
    return next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: `Book with id ${id} not found.` });
    }

    return res.json(book);–›
  } catch (error) {
    return next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;
    const { isValid, sanitizedTitle, sanitizedAuthor, message } = validatePayload(title, author);

    if (!isValid) {
      return res.status(400).json({ message });
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: `Book with id ${id} not found.` });
    }

    book.title = sanitizedTitle;
    book.author = sanitizedAuthor;
    await book.save();

    return res.json(book);
  } catch (error) {
    return next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCount = await Book.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: `Book with id ${id} not found.` });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
