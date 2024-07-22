import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/client";
import { StatusCodes } from "http-status-codes";
import { updateFavoriteSchema } from "../../schema/validationSchema";
import BadRequestError from "../../errors/bad_request";

export const addBookToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.body;

    const { error } = updateFavoriteSchema.validate({ bookId });

    if (error) throw new BadRequestError(error.message);

    await prisma.usersFavoriteBooks.create({
      data: {
        bookId: bookId,
        userId: req.user?.userId!,
      },
    });

    res.status(StatusCodes.OK).json({ status: "success" });
  } catch (e) {
    next(e);
  }
};

export const removeBookFromFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.body;

    const { error } = updateFavoriteSchema.validate({ bookId });

    if (error) throw new BadRequestError(error.message);

    await prisma.usersFavoriteBooks.delete({
      where: {
        userId_bookId: { userId: req.user?.userId!, bookId: bookId },
      },
    });

    res.status(StatusCodes.OK).json({ status: "success" });
  } catch (e) {
    next(e);
  }
};
