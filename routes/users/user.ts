import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../../controlers/users/auth";

export const route = Router()

route.route('/').get(getAllUsers).post(createUser)
route.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
