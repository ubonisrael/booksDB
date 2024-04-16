import { Router } from "express";
import { createAuthor, deleteAuthor, getAllAuthors, getAuthor, updateAuthor } from "../../controlers/authors/authors";

export const route = Router()

route.route('/').get(getAllAuthors).post(createAuthor)
route.route('/:id').get(getAuthor).patch(updateAuthor).delete(deleteAuthor)
