import { NextFunction, Request, Response } from "express";
import { prisma, updateBookRating } from "../../db/client";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../../errors/not_found";
import BadRequestError from "../../errors/bad_request";
import { reviewSchema, forbiddenAttr } from "../../schema/validationSchema";

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // added support for pagination, filtering (limit, offset), and searching
  const pageNumber = Number(req.query["page"]) || 1;
  const limit = Number(req.query["limit"]) || 10;
  const skip = (pageNumber - 1) * limit;
  const searchRegex = new RegExp(`${req.query["search"] || ""}`, "gi");

  const reviews = (
    await prisma.review.findMany({
      skip: skip,
      take: limit,
    })
  )
    .sort()
    .filter((re) => searchRegex.test(re.body));
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await prisma.review.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        author: true,
        book: true
      }
    });
    if (!review) {
      throw new NotFoundError(
        `Review with id-${req.params.id} does not exist.`
      );
    }
    res.status(StatusCodes.OK).json({ review });
  } catch (e) {
    next(e);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vote, body, bookId, authorId } = req.body;

    if (!vote || vote < 0 || vote > 10)
      throw new BadRequestError("Review must have a vote ranging from 1 - 10");
    if (!body)
      throw new BadRequestError(
        "Review must have a body with at least 10 characters"
      );
    if (!bookId) throw new BadRequestError("Review must have a book Id");
    if (!authorId) throw new BadRequestError("Review must have an author Id");

    const { error, value } = reviewSchema.validate({
      vote,
      body,
      bookId,
      authorId,
    });

    if (error) throw new BadRequestError(error.message);

    // should a user be able to have multiple reviews on a particular book?
    // decision - pending

    const review = await prisma.review.create({
      data: value,
    });
    // update the rating column of the book associated with the review
    await updateBookRating(review.bookId);
    res.status(StatusCodes.CREATED).json({ review });
  } catch (e) {
    next(e);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const x of forbiddenAttr) {
      if (x in req.body) delete req.body[x];
    }

    const { error, value } = reviewSchema.validate(req.body);

    if (error) throw new BadRequestError(error.message);

    const review = await prisma.review.update({
      where: {
        id: req.params.id,
        // only the user who created the review should be able to update it
        authorId: value.authorId,
      },
      data: value,
    });
    // update the rating column of the book associated with the review
    await updateBookRating(review.bookId);

    res.status(StatusCodes.OK).json({ review });
  } catch (e) {
    next(e);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await prisma.review.delete({
      where: {
        id: req.params.id,
      },
    });
    if (!review) {
      throw new NotFoundError(
        `Review with id-${req.params.id} does not exist.`
      );
    }
    res.status(StatusCodes.OK).json({status: "success" });
  } catch (e) {
    next(e);
  }
};
