import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/client";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../../errors/not_found";
import BadRequestError from "../../errors/bad_request";
import { bookSchema, forbiddenAttr } from "../../schema/validationSchema";

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // added support for pagination, filtering (limit, offset), and searching
  const pageNumber = Number(req.query["page"]) || 1;
  const limit = Number(req.query["limit"]) || 10;
  const skip = (pageNumber - 1) * limit;
  const searchRegex = new RegExp(`${req.query["search"] || ""}`, "gi");

  const books = (
    await prisma.book.findMany({
      skip: skip,
      take: limit,
    })
  )
    .sort()
    .filter((book) => searchRegex.test(book.title));

  res.status(StatusCodes.OK).json({ books, count: books.length });
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await prisma.book.findUnique({
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
      throw new NotFoundError(`Book with id-${req.params.id} does not exist.`);
    }

    res.status(StatusCodes.OK).json({ book });
  } catch (e) {
    next(e);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, summary, imgUrl, pageNumber } = req.body;

    if (!title) throw new BadRequestError("Please input title");
    if (!summary) throw new BadRequestError("Please input summary");
    if (!pageNumber) throw new BadRequestError("Please input number of pages");

    const { error, value } = bookSchema.validate({
      title,
      summary,
      imgUrl,
      pageNumber,
    });

    if (error) throw new BadRequestError(error.message);

    const book = await prisma.book.create({
      data: value,
    });
    res.status(StatusCodes.CREATED).json({ book });
  } catch (e) {
    next(e);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const x of forbiddenAttr) {
      if (x in req.body) delete req.body[x];
    }

    const { error, value } = bookSchema.validate(req.body);

    if (error) throw new BadRequestError(error.message);

    const book = await prisma.book.update({
      where: {
        id: req.params.id,
      },
      data: value,
    });

    res.status(StatusCodes.OK).json({ book });
  } catch (e) {
    next(e);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await prisma.book.delete({
      where: {
        id: req.params.id,
      },
    });
    if (!book) {
      throw new NotFoundError(`Book with id-${req.params.id} does not exist.`);
    }
    res.status(StatusCodes.OK).json({ status: "success" });
  } catch (e) {
    next(e);
  }
};
