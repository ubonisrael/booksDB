import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/client";
import { compare, genSalt, hash } from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { userSchema } from "../../schema/validationSchema";
import jwt from "jsonwebtoken";
import BadRequestError from "../../errors/bad_request";
import UnauthenticatedError from "../../errors/auth_error";

export const getAllUsers = async (req: Request, res: Response) => {
  res.send("Gets all users");
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
      { expiresIn: process.env.JWT_EXPIRES_IN}
    );
    return res.status(StatusCodes.OK).json({ user, token });
  } catch (e) {
    next(e);
  }
};

// export const getUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password)
//       throw new BadRequestError("Username or Password must not be empty");

//     const user = await prisma.user.findUnique({
//       where: {
//         username: username,
//       },
//     });

//     if (!user) throw new UnauthenticatedError("Invalid credentials");

//     const isPasswordCorrect = await compare(password, user.password);
//     if (!isPasswordCorrect)
//       throw new UnauthenticatedError("Invalid credentials");

//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       process.env.JWT_SECRET as string,
//       { expiresIn: process.env.JWT_EXPIRES_IN}
//     );
//     return res.status(StatusCodes.OK).json({ user, token });
//   } catch (e) {
//     next(e);
//   }
// };

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

    const user = await prisma.user.create({
      data: value,
    });
    res.status(StatusCodes.CREATED).json({ user });
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  res.send("Update user");
};

export const deleteUser = async (req: Request, res: Response) => {
  res.send("delete user");
};
