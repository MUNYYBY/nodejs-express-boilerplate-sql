const Joi = require('joi');
const { password, uuid } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(uuid),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      phone: Joi.string().length(11),
      companyName: Joi.string(),
      companyDomain: Joi.string(),
      companyAddress: Joi.string(),
      postalCode: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      isBlock: Joi.boolean(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(uuid),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
};
