"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const books_1 = require("../../controllers/books/books");
exports.route = (0, express_1.Router)();
exports.route.route('/').get(books_1.getAllBooks).post(books_1.createBook);
exports.route.route('/:id').get(books_1.getBook).patch(books_1.updateBook).delete(books_1.deleteBook);
