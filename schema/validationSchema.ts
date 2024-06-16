import Joi from "joi";

export const forbiddenAttr = ["id", "createdAt", "updatedAt", "password"];

export const authorSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  bio: Joi.string().min(8).required(),
  avatar: Joi.string(),
});

export const userSchema = Joi.object({
  email: Joi.string()
    .regex(new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}"))
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .regex(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
  confirmPassword: Joi.ref("password"),
  avatar: Joi.string(),
});

export const updateFavoriteSchema = Joi.object({
  bookId: Joi.string().required(),
});

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .regex(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required(),
  confirmPassword: Joi.ref("newPassword"),
});

export const bookSchema = Joi.object({
  title: Joi.string().required(),
  summary: Joi.string().min(10).required(),
  imgUrl: Joi.string(),
  pageNumber: Joi.number().required(),
  authorIds: Joi.array().items(Joi.string()).min(1).required(),
});

export const reviewSchema = Joi.object({
  vote: Joi.number().min(0).max(10).required(),
  body: Joi.string().min(10).required(),
  bookId: Joi.string().required(),
  authorId: Joi.string().required(),
});
