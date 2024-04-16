import { Router } from "express";
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "../../controlers/reviews/reviews";

export const route = Router()

route.route('/').get(getAllReviews).post(createReview)
route.route('/:id').get(getReview).patch(updateReview).delete(deleteReview)
