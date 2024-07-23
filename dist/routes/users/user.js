"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const users_1 = require("../../controllers/users/users");
exports.route = (0, express_1.Router)();
exports.route.route("/").get(users_1.getAllUsers).post(users_1.createUser);
exports.route.route("/:id").get(users_1.getUser).patch(users_1.updateUser).delete(users_1.deleteUser);
