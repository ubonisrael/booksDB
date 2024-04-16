import { Router } from "express";
import { createBook, deleteBook, getAllBooks, getBook, updateBook } from "../../controlers/books/books";

export const route = Router()

route.route('/').get(getAllBooks).post(createBook)
route.route('/:id').get(getBook).patch(updateBook).delete(deleteBook)
