"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const reviews_1 = require("../../controllers/reviews/reviews");
exports.route = (0, express_1.Router)();
exports.route.route('/').get(reviews_1.getAllReviews).post(reviews_1.createReview);
exports.route.route('/:id').get(reviews_1.getReview).patch(reviews_1.updateReview).delete(reviews_1.deleteReview);
