"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const authors_1 = require("../../controllers/authors/authors");
exports.route = (0, express_1.Router)();
exports.route.route('/').get(authors_1.getAllAuthors).post(authors_1.createAuthor);
exports.route.route('/:id').get(authors_1.getAuthor).patch(authors_1.updateAuthor).delete(authors_1.deleteAuthor);
