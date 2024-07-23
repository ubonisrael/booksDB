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
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const client_1 = require("../../db/client");
const http_status_codes_1 = require("http-status-codes");
const not_found_1 = __importDefault(require("../../errors/not_found"));
const bad_request_1 = __importDefault(require("../../errors/bad_request"));
const validationSchema_1 = require("../../schema/validationSchema");
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // added support for pagination, filtering (limit, offset), and searching
    const pageNumber = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const skip = (pageNumber - 1) * limit;
    const books = (yield client_1.prisma.book.findMany({
        where: {
            title: {
                search: req.query["search"] ? `${req.query["search"]}` : undefined,
            },
        },
        skip: skip,
        take: limit,
    })).sort();
    res.status(http_status_codes_1.StatusCodes.OK).json({ books, count: books.length });
});
exports.getAllBooks = getAllBooks;
const getBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield client_1.prisma.book.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                authors: true,
                likedBy: true,
                reviews: true,
            },
        });
        if (!book) {
            throw new not_found_1.default(`Book with id-${req.params.id} does not exist.`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ book });
    }
    catch (e) {
        next(e);
    }
});
exports.getBook = getBook;
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, summary, imgUrl, pageNumber, authorIds } = req.body;
        if (!title)
            throw new bad_request_1.default("Please input title");
        if (!summary)
            throw new bad_request_1.default("Please input summary");
        if (!pageNumber)
            throw new bad_request_1.default("Please input number of pages");
        if (!authorIds || authorIds.length <= 0)
            throw new bad_request_1.default("Please input the ID(s) of the author(s)");
        const { error, value } = validationSchema_1.bookSchema.validate({
            title,
            summary,
            imgUrl,
            pageNumber,
            authorIds,
        });
        if (error)
            throw new bad_request_1.default(error.message);
        const authors = value.authorIds.map((id) => ({ author: { connect: { id } } }));
        delete value.authorIds;
        const book = yield client_1.prisma.book.create({
            data: Object.assign(Object.assign({}, value), { authors: {
                    create: authors,
                } }),
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ book });
    }
    catch (e) {
        next(e);
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const x of validationSchema_1.forbiddenAttr) {
            if (x in req.body)
                delete req.body[x];
        }
        const { error, value } = validationSchema_1.bookSchema.validate(req.body);
        if (error)
            throw new bad_request_1.default(error.message);
        const authorsOfBooks = value.authorIds.map((id) => ({ authorId: id, bookId: req.params.id }));
        delete value.authorIds;
        const book = yield client_1.prisma.book.update({
            where: {
                id: req.params.id,
            },
            data: Object.assign({}, value),
        });
        yield client_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.authorsOfBooks.deleteMany({
                where: {
                    bookId: book.id
                }
            });
            yield prisma.authorsOfBooks.createMany({
                data: authorsOfBooks
            });
            return book;
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json({ book });
    }
    catch (e) {
        next(e);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // disconnect all associated records
            yield prisma.authorsOfBooks.deleteMany({
                where: {
                    bookId: req.params.id
                }
            });
            yield prisma.usersFavoriteBooks.deleteMany({
                where: {
                    bookId: req.params.id
                }
            });
            // finally, delete book
            yield prisma.book.delete({
                where: {
                    id: req.params.id,
                },
            });
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success" });
    }
    catch (e) {
        next(e);
    }
});
exports.deleteBook = deleteBook;
