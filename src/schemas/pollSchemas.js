import joi from "joi";

export const pollSchema = joi.object({
    title: joi.string().required(),
    expireAt: joi.date().required()
  });
  