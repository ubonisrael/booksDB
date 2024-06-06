import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/client";
import { compare, genSalt, hash } from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import {
  forbiddenAttr,
  updateFavoriteSchema,
  userSchema,
} from "../../schema/validationSchema";
import jwt from "jsonwebtoken";
import BadRequestError from "../../errors/bad_request";
import UnauthenticatedError from "../../errors/auth_error";
import NotFoundError from "../../errors/not_found";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // added support for pagination, filtering (limit, offset)
    const pageNumber = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const skip = (pageNumber - 1) * limit;
    const searchRegex = new RegExp(`${req.query["search"] || ""}`, "gi");
    const users = (
      await prisma.user.findMany({
        skip: skip,
        take: limit,
      })
    )
      .sort()
      .filter(
        (us) =>
          searchRegex.test(us.firstName) ||
          searchRegex.test(us.lastName) ||
          searchRegex.test(us.username)
      );
    res.status(StatusCodes.OK).json({ users, count: users.length });
  } catch (e) {
    next(e);
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw new BadRequestError("Username or Password must not be empty");

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) throw new UnauthenticatedError("Invalid credentials");

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthenticatedError("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, username: user.username, admin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.status(StatusCodes.OK).json({ userId: user["id"], token });
  } catch (e) {
    next(e);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      confirmPassword,
      avatar,
    } = req.body;

    const { error, value } = userSchema.validate({
      email,
      username,
      firstName,
      lastName,
      password,
      confirmPassword,
      avatar,
    });
    if (error) throw new BadRequestError(error.message);

    const salt = await genSalt();
    value.password = await hash(password, salt);
    // remove the confirmPassword attribute
    delete value.confirmPassword;

    // only admins should be able to create another admin
    // if the route is authenticated, this means that
    // this is an attempt at creating an admin
    // check if the user is an admin and add isAdmin boolean
    // else skip
    if (req.user?.isAdmin) value.isAdmin = true;

    const user = await prisma.user.create({
      data: value,
    });

    res.status(StatusCodes.CREATED).json({ user });
  } catch (e) {
    next(e);
  }
};

// *** CHANGE TO UPDATE PASSWORD LATER ?? Or add password update functionality
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const x of forbiddenAttr) {
      if (x in req.body) delete req.body[x];
    }

    const { error, value } = userSchema.validate(req.body);

    if (error) throw new BadRequestError(error.message);

    const user = await prisma.user.update({
      where: {
        id: req.user?.userId,
      },
      data: value,
    });

    if (!user)
      throw new NotFoundError(`User with id-${req.user?.userId} not found.`);

    res.status(StatusCodes.OK).json({ user });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteReviews = prisma.review.deleteMany({
      where: {
        authorId: req.params.id,
      },
    })
    const deleteUser = prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    await prisma.$transaction([deleteReviews, deleteUser])
    res.status(StatusCodes.OK).json({ status: "success" });
  } catch (e) {
    next(e);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        favoriteBooks: true,
        reviews: true,
      },
    });
    if (!user) {
      throw new NotFoundError(`user with id-${req.params.id} does not exist.`);
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (e) {
    next(e);
  }
};

export const addBookToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.body;

    const { error, value } = updateFavoriteSchema.validate({ bookId });

    if (error) throw new BadRequestError(error.message);

    const user = await prisma.user.update({
      where: {
        id: req.user?.userId,
      },
      data: {
        favoriteBooks: {
          set: {
            id: value.bookId,
          },
        },
      },
    });

    if (!user)
      throw new NotFoundError(`User with id-${req.user?.userId} not found.`);

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

    const { error, value } = updateFavoriteSchema.validate({ bookId });

    if (error) throw new BadRequestError(error.message);

    const user = await prisma.user.update({
      where: {
        id: req.user?.userId,
      },
      data: {
        favoriteBooks: {
          delete: {
            id: value.bookId,
          },
        },
      },
    });

    if (!user)
      throw new NotFoundError(`User with id-${req.user?.userId} not found.`);

    res.status(StatusCodes.OK).json({ status: "success" });
  } catch (e) {
    next(e);
  }
};
