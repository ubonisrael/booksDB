import Joi from "joi";

export const forbiddenAttr = ['id', 'createdAt', 'updatedAt']

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
