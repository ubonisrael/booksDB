import { Router } from "express";
import { Login, changePassword, createUser } from "../../controllers/users/users";

export const route = Router()

route.route('/register').post(createUser)
route.route('/login').post(Login)
route.route('/updatePassword').patch(changePassword)
