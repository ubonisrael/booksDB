"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const favorites_1 = require("../../controllers/favorites/favorites");
exports.route = (0, express_1.Router)();
exports.route.route("/").post(favorites_1.addBookToFavorites).delete(favorites_1.removeBookFromFavorites);
