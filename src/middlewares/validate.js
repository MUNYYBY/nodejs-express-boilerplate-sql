const Joi = require('joi');
const httpStatus = require('http-status').status;
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  // req.params/query/body are inherited getters on Express 5's request prototype rather
  // than own properties, so a hasOwnProperty-based pick() would silently drop them; read
  // them directly instead, defaulting missing ones so nested Joi `.required()` checks run.
  const object = {};
  Object.keys(validSchema).forEach((key) => {
    object[key] = req[key] ?? {};
  });
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  // req.query is a getter-only property in Express 5, so it must be mutated in place
  // rather than reassigned; req.params/req.body remain directly writable.
  Object.keys(value).forEach((key) => {
    if (key === 'query') {
      Object.assign(req.query, value.query);
    } else {
      req[key] = value[key];
    }
  });
  return next();
};

module.exports = validate;
