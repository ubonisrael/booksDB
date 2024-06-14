import { Router } from "express";
import {
  addBookToFavorites,
  createUser as createAdmin,
  deleteUser,
  getAllUsers,
  getUser,
  removeBookFromFavorites,
  updateUser,
} from "../../controllers/users/users";

export const route = Router();

route.route("/").get(getAllUsers).post(createAdmin);
route.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
route
  .route("/:id/favorites")
  .patch(addBookToFavorites)
  .delete(removeBookFromFavorites);
