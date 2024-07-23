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
exports.deleteAuthor = exports.updateAuthor = exports.createAuthor = exports.getAuthor = exports.getAllAuthors = void 0;
const client_1 = require("../../db/client");
const http_status_codes_1 = require("http-status-codes");
const bad_request_1 = __importDefault(require("../../errors/bad_request"));
const not_found_1 = __importDefault(require("../../errors/not_found"));
const validationSchema_1 = require("../../schema/validationSchema");
const getAllAuthors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // added support for pagination, filtering (limit, offset)
    const pageNumber = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const skip = (pageNumber - 1) * limit;
    const authors = (yield client_1.prisma.author.findMany({
        where: {
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
    res.status(http_status_codes_1.StatusCodes.OK).json({ authors, count: authors.length });
});
exports.getAllAuthors = getAllAuthors;
const getAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield client_1.prisma.author.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                works: true
            }
        });
        if (!author) {
            throw new not_found_1.default(`Author with id-${req.params.id} does not exist.`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ author });
    }
    catch (e) {
        next(e);
    }
});
exports.getAuthor = getAuthor;
const createAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, bio, avatar } = req.body;
        if (!firstName)
            throw new bad_request_1.default("First name cannot be empty");
        if (!lastName)
            throw new bad_request_1.default("Last name cannot be empty");
        if (!bio)
            throw new bad_request_1.default("Bio cannot be empty");
        const { error, value } = validationSchema_1.authorSchema.validate({
            firstName,
            lastName,
            bio,
            avatar,
        });
        if (error)
            throw new bad_request_1.default(error.message);
        const author = yield client_1.prisma.author.create({
            data: value,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ author });
    }
    catch (e) {
        next(e);
    }
});
exports.createAuthor = createAuthor;
const updateAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const x of validationSchema_1.forbiddenAttr) {
            if (x in req.body)
                delete req.body[x];
        }
        const { error, value } = validationSchema_1.authorSchema.validate(req.body);
        if (error)
            throw new bad_request_1.default(error.message);
        const author = yield client_1.prisma.author.update({
            where: {
                id: req.params.id,
            },
            data: value,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ author });
    }
    catch (e) {
        next(e);
    }
});
exports.updateAuthor = updateAuthor;
const deleteAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // disconnect all book records associated with this author
            yield prisma.authorsOfBooks.deleteMany({
                where: {
                    authorId: req.params.id
                }
            });
            // finally remove author from db
            yield prisma.author.delete({
                where: {
                    id: req.params.id,
                },
            });
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json({});
    }
    catch (e) {
        next(e);
    }
});
exports.deleteAuthor = deleteAuthor;
