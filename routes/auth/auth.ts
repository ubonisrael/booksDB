import { Router } from "express";
import { createUser, getUser } from "../../controlers/users/users";

export const route = Router()

route.route('/register').post(createUser)
route.route('/login').post(getUser)
