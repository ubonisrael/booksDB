import { Router } from "express";
import { createUser as createAdmin, deleteUser, getAllUsers, getUser, updateUser } from "../../controllers/users/users";

export const route = Router()

route.route('/').get(getAllUsers).post(createAdmin)
route.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
