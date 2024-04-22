import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/client";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../../errors/not_found";
import BadRequestError from "../../errors/bad_request";
import { reviewSchema, forbiddenAttr } from "../../schema/validationSchema";


export const getAllReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const reviews = (await prisma.review.findMany()).sort();
    res.status(StatusCodes.OK).json({ data: reviews });
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
      const {
        vote,
        body,
        bookId,
        authorId
      } = req.body;
  
      if (!vote) throw new BadRequestError("Review must have a vote ranging from 1 - 10");
      if (!body) throw new BadRequestError("Review must have a body with at least 10 characters");
      if (!bookId) throw new BadRequestError("Review must have a book Id");
      if (!authorId) throw new BadRequestError("Review must have an author Id");
  
      const { error, value } = reviewSchema.validate({
        vote,
        body,
        bookId,
        authorId
      });
  
      if (error) throw new BadRequestError(error.message);
  
      const review = await prisma.review.create({
        data: value,
      });
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
        },
        data: value,
      });
      res.status(StatusCodes.OK).json({ data: review });
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
      res.status(StatusCodes.OK).json({});
    } catch (e) {
      next(e);
    }
  };
  