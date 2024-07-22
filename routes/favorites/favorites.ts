import { Router } from "express";
import {
  addBookToFavorites,
  removeBookFromFavorites,
} from "../../controllers/favorites/favorites";

export const route = Router();

route.route("/").post(addBookToFavorites).delete(removeBookFromFavorites);
