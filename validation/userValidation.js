
const Joi = require("joi");

const validateUser = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().regex(/^[A-Za-z\s]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/)
      .required(),
  });
  return schema.validate(data);
};

const validatePassword = (password) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/)
      .required(),
  });
  return schema.validate({ password });
};

module.exports = { validateUser, validatePassword };
            