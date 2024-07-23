"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = exports.bookSchema = exports.updatePasswordSchema = exports.updateFavoriteSchema = exports.userSchema = exports.authorSchema = exports.forbiddenAttr = void 0;
const joi_1 = __importDefault(require("joi"));
exports.forbiddenAttr = ["id", "createdAt", "updatedAt", "password"];
exports.authorSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    bio: joi_1.default.string().min(8).required(),
    avatar: joi_1.default.string(),
});
exports.userSchema = joi_1.default.object({
    email: joi_1.default.string()
        .regex(new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}"))
        .required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
    password: joi_1.default.string()
        .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
        .required(),
    confirmPassword: joi_1.default.ref("password"),
    avatar: joi_1.default.string(),
});
exports.updateFavoriteSchema = joi_1.default.object({
    bookId: joi_1.default.string().required(),
});
exports.updatePasswordSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
        .required(),
    confirmPassword: joi_1.default.ref("newPassword"),
});
exports.bookSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    summary: joi_1.default.string().min(10).required(),
    imgUrl: joi_1.default.string(),
    pageNumber: joi_1.default.number().required(),
    authorIds: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
});
exports.reviewSchema = joi_1.default.object({
    vote: joi_1.default.number().min(0).max(10).required(),
    body: joi_1.default.string().min(10).required(),
    bookId: joi_1.default.string().required(),
    authorId: joi_1.default.string().required(),
});
