import { Request, Response } from "express";
import { prisma } from "../../db/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { StatusCodes } from "http-status-codes";

export const getAllAuthors = async (req: Request, res: Response) => {
  const authors = (await prisma.author.findMany()).sort();
  res.status(StatusCodes.OK).json({ data: authors });
};

export const getAuthor = async (req: Request, res: Response) => {
  const author = await prisma.author.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (author == null) {
    res.status(StatusCodes.NOT_FOUND).json({
      Error: {
        message: `Record with id-${req.params.id} does not exist.`,
      },
    });
  } else {
    res.status(StatusCodes.OK).json({ author });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  try {
    const author = await prisma.author.create({
      data: req.body,
    });
    res.status(StatusCodes.CREATED).json({ author });
  } catch (e) {
    if (e instanceof PrismaClientValidationError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        Error: {
          message: "Missing field or incorrect field type",
        },
      });
    }
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    if ("id" in req.body) delete req.body.id;
    const author = await prisma.author.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.status(StatusCodes.OK).json({ data: author });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(StatusCodes.NOT_FOUND).json({
        Error: { message: e.meta?.cause },
      });
    } else if (e instanceof PrismaClientValidationError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        Error: {
          message: "Incorrect field type",
        },
      });
    }
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    await prisma.author.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(StatusCodes.OK).json({});
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(StatusCodes.NOT_FOUND).json({
        Error: { message: e.meta?.cause },
      });
    }
  }
};
