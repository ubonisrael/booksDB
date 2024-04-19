import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/client";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad_request";
import NotFoundError from "../../errors/not_found";
import { authorSchema, forbiddenAttr } from "../../schema/validationSchema";

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authors = (await prisma.author.findMany()).sort();
  res.status(StatusCodes.OK).json({ data: authors });
};

export const getAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await prisma.author.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!author) {
      throw new NotFoundError(
        `Author with id-${req.params.id} does not exist.`
      );
    }
    res.status(StatusCodes.OK).json({ author });
  } catch (e) {
    next(e);
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;

    if (!firstName) throw new BadRequestError("Please input first name");
    if (!lastName) throw new BadRequestError("Please input last name");
    if (!bio) throw new BadRequestError("Please input bio");

    const { error } = authorSchema.validate({
      firstName,
      lastName,
      bio,
      avatar,
    });

    if (error) throw new BadRequestError(error.message);

    const author = await prisma.author.create({
      data: req.body,
    });
    res.status(StatusCodes.CREATED).json({ author });
  } catch (e) {
    next(e);
  }
};

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const x of forbiddenAttr) {
      if (x in req.body) delete req.body[x];
    }

    const { error } = authorSchema.validate(req.body);

    if (error) throw new BadRequestError(error.message);

    const author = await prisma.author.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.status(StatusCodes.OK).json({ data: author });
  } catch (e) {
    next(e);
  }
};

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await prisma.author.delete({
      where: {
        id: req.params.id,
      },
    });
    if (!author) {
      throw new NotFoundError(
        `Author with id-${req.params.id} does not exist.`
      );
    }
    res.status(StatusCodes.OK).json({});
  } catch (e) {
    next(e);
  }
};
