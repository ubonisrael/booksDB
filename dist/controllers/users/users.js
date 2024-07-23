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
exports.getUser = exports.deleteUser = exports.changePassword = exports.updateUser = exports.createUser = exports.Login = exports.getAllUsers = void 0;
const client_1 = require("../../db/client");
const bcryptjs_1 = require("bcryptjs");
const http_status_codes_1 = require("http-status-codes");
const validationSchema_1 = require("../../schema/validationSchema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bad_request_1 = __importDefault(require("../../errors/bad_request"));
const auth_error_1 = __importDefault(require("../../errors/auth_error"));
const not_found_1 = __importDefault(require("../../errors/not_found"));
const auth_handler_1 = require("../../middleware/auth_handler");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // added support for pagination, filtering (limit, offset)
        const pageNumber = Number(req.query["page"]) || 1;
        const limit = Number(req.query["limit"]) || 10;
        const skip = (pageNumber - 1) * limit;
        const users = (yield client_1.prisma.user.findMany({
            where: {
                username: {
                    search: req.query["search"] ? `${req.query["search"]}` : undefined,
                },
                firstName: {
                    search: req.query["search"] ? `${req.query["search"]}` : undefined,
                },
                lastName: {
                    search: req.query["search"] ? `${req.query["search"]}` : undefined,
                },
            },
            skip: skip,
            take: limit,
        })).sort();
        res.status(http_status_codes_1.StatusCodes.OK).json({ users, count: users.length });
    }
    catch (e) {
        next(e);
    }
});
exports.getAllUsers = getAllUsers;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw new bad_request_1.default("Username or Password must not be empty");
        const user = yield client_1.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user)
            throw new auth_error_1.default("Invalid credentials");
        const isPasswordCorrect = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordCorrect)
            throw new auth_error_1.default("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, admin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ userId: user["id"], token });
    }
    catch (e) {
        next(e);
    }
});
exports.Login = Login;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, username, firstName, lastName, password, confirmPassword, avatar, } = req.body;
        const { error, value } = validationSchema_1.userSchema.validate({
            email,
            username,
            firstName,
            lastName,
            password,
            confirmPassword,
            avatar,
        });
        if (error)
            throw new bad_request_1.default(error.message);
        const salt = yield (0, bcryptjs_1.genSalt)();
        value.password = yield (0, bcryptjs_1.hash)(password, salt);
        // remove the confirmPassword attribute
        delete value.confirmPassword;
        // only admins should be able to create another admin
        // if the route is authenticated, this means that
        // this is an attempt at creating an admin
        // check if the user is an admin and add isAdmin boolean
        // else skip
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)
            value.isAdmin = true;
        const user = yield client_1.prisma.user.create({
            data: value,
        });
        const user_copy = (({ id, email, username }) => ({ id, email, username }))(user);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ created: user_copy });
    }
    catch (e) {
        next(e);
    }
});
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        for (const x of validationSchema_1.forbiddenAttr) {
            if (x in req.body)
                delete req.body[x];
        }
        const { error, value } = validationSchema_1.userSchema.validate(req.body);
        if (error)
            throw new bad_request_1.default(error.message);
        const user = yield client_1.prisma.user.update({
            where: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
            },
            data: value,
        });
        if (!user)
            throw new not_found_1.default(`User with id-${(_c = req.user) === null || _c === void 0 ? void 0 : _c.userId} not found.`);
        res.status(http_status_codes_1.StatusCodes.OK).json({ user });
    }
    catch (e) {
        next(e);
    }
});
exports.updateUser = updateUser;
// added password update functionality == DONE
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = (0, auth_handler_1.jwtHandler)(req);
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const { error, value } = validationSchema_1.updatePasswordSchema.validate({
            oldPassword,
            newPassword,
            confirmPassword,
        });
        if (error)
            throw new bad_request_1.default(error.message);
        let user = yield client_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new auth_error_1.default("Invalid credentials");
        const isPasswordCorrect = yield (0, bcryptjs_1.compare)(value.oldPassword, user.password);
        if (!isPasswordCorrect)
            throw new auth_error_1.default("Invalid credentials");
        const salt = yield (0, bcryptjs_1.genSalt)();
        const newPasswordHash = yield (0, bcryptjs_1.hash)(value.newPassword, salt);
        user = yield client_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: newPasswordHash,
            },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ user });
    }
    catch (e) {
        next(e);
    }
});
exports.changePassword = changePassword;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteBooks = client_1.prisma.usersFavoriteBooks.deleteMany({
            where: {
                userId: req.params.id,
            },
        });
        const deleteUser = client_1.prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        yield client_1.prisma.$transaction([deleteBooks, deleteUser]);
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success" });
    }
    catch (e) {
        next(e);
    }
});
exports.deleteUser = deleteUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                favoriteBooks: true,
                reviews: true,
            },
        });
        if (!user) {
            throw new not_found_1.default(`user with id-${req.params.id} does not exist.`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ user });
    }
    catch (e) {
        next(e);
    }
});
exports.getUser = getUser;
