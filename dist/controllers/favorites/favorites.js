"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBookFromFavorites = exports.addBookToFavorites = void 0;
const client_1 = require("../../db/client");
const http_status_codes_1 = require("http-status-codes");
const validationSchema_1 = require("../../schema/validationSchema");
const bad_request_1 = __importDefault(require("../../errors/bad_request"));
const addBookToFavorites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { bookId } = req.body;
        const { error } = validationSchema_1.updateFavoriteSchema.validate({ bookId });
        if (error)
            throw new bad_request_1.default(error.message);
        yield client_1.prisma.usersFavoriteBooks.create({
            data: {
                bookId: bookId,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success" });
    }
    catch (e) {
        next(e);
    }
});
exports.addBookToFavorites = addBookToFavorites;
const removeBookFromFavorites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { bookId } = req.body;
        const { error } = validationSchema_1.updateFavoriteSchema.validate({ bookId });
        if (error)
            throw new bad_request_1.default(error.message);
        yield client_1.prisma.usersFavoriteBooks.delete({
            where: {
                userId_bookId: { userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, bookId: bookId },
            },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success" });
    }
    catch (e) {
        next(e);
    }
});
exports.removeBookFromFavorites = removeBookFromFavorites;
