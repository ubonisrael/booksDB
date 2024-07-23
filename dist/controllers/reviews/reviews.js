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
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReview = exports.getAllReviews = void 0;
const client_1 = require("../../db/client");
const http_status_codes_1 = require("http-status-codes");
const not_found_1 = __importDefault(require("../../errors/not_found"));
const bad_request_1 = __importDefault(require("../../errors/bad_request"));
const validationSchema_1 = require("../../schema/validationSchema");
const getAllReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // added support for pagination, filtering (limit, offset), and searching
    const pageNumber = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const skip = (pageNumber - 1) * limit;
    const searchRegex = new RegExp(`${req.query["search"] || ""}`, "gi");
    const reviews = (yield client_1.prisma.review.findMany({
        skip: skip,
        take: limit,
    }))
        .sort()
        .filter((re) => searchRegex.test(re.body));
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getAllReviews = getAllReviews;
const getReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield client_1.prisma.review.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                author: true,
                book: true,
            },
        });
        if (!review) {
            throw new not_found_1.default(`Review with id-${req.params.id} does not exist.`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ review });
    }
    catch (e) {
        next(e);
    }
});
exports.getReview = getReview;
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vote, body, bookId, authorId } = req.body;
        if (!vote || vote < 0 || vote > 10)
            throw new bad_request_1.default("Review must have a vote ranging from 1 - 10");
        if (!body)
            throw new bad_request_1.default("Review must have a body with at least 10 characters");
        if (!bookId)
            throw new bad_request_1.default("Review must have a book Id");
        if (!authorId)
            throw new bad_request_1.default("Review must have an author Id");
        const { error, value } = validationSchema_1.reviewSchema.validate({
            vote,
            body,
            bookId,
            authorId,
        });
        if (error)
            throw new bad_request_1.default(error.message);
        // should a user be able to have multiple reviews on a particular book?
        // decision - no
        const book = yield client_1.prisma.book.findUnique({
            where: {
                id: value.bookId,
            },
            include: {
                reviews: true,
            },
        });
        if (book) {
            for (const review of book.reviews) {
                if (review.authorId === value.authorId) {
                    throw new bad_request_1.default("Cannot have more than one review of a book at a time");
                }
            }
        }
        const review = yield client_1.prisma.review.create({
            data: value,
        });
        // update the rating column of the book associated with the review
        yield (0, client_1.updateBookRating)(review.bookId);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ review });
    }
    catch (e) {
        next(e);
    }
});
exports.createReview = createReview;
const updateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const x of validationSchema_1.forbiddenAttr) {
            if (x in req.body)
                delete req.body[x];
        }
        const { error, value } = validationSchema_1.reviewSchema.validate(req.body);
        if (error)
            throw new bad_request_1.default(error.message);
        const review = yield client_1.prisma.review.update({
            where: {
                id: req.params.id,
                // only the user who created the review should be able to update it
                authorId: value.authorId,
            },
            data: value,
        });
        // update the rating column of the book associated with the review
        yield (0, client_1.updateBookRating)(review.bookId);
        res.status(http_status_codes_1.StatusCodes.OK).json({ review });
    }
    catch (e) {
        next(e);
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = yield client_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const review = yield prisma.review.delete({
                where: {
                    id: req.params.id,
                },
            });
            if (!review) {
                throw new not_found_1.default(`Review with id-${req.params.id} does not exist.`);
            }
            return review.bookId;
        }));
        yield (0, client_1.updateBookRating)(bookId);
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success" });
    }
    catch (e) {
        next(e);
    }
});
exports.deleteReview = deleteReview;
