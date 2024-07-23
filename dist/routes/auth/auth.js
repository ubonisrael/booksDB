"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const users_1 = require("../../controllers/users/users");
exports.route = (0, express_1.Router)();
exports.route.route('/register').post(users_1.createUser);
exports.route.route('/login').post(users_1.Login);
exports.route.route('/updatePassword').patch(users_1.changePassword);
