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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookRating = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const updateBookRating = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield exports.prisma.book.findUnique({
        where: {
            id: bookId,
        },
        include: {
            reviews: true,
        },
    });
    if (book) {
        const newRating = book.reviews.length > 0
            ? book.reviews.reduce((acc, b) => acc + b.vote, 0) / book.reviews.length
            : 0;
        yield exports.prisma.book.update({
            where: {
                id: book.id,
            },
            data: {
                rating: newRating,
            },
        });
    }
});
exports.updateBookRating = updateBookRating;
