const bcrypt = require('bcryptjs');
const httpStatus = require('http-status').status;
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { prisma } = require('../prisma/prisma-connection');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.createUser(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter) => {
  const users = await User.QueryUsers(filter);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {ObjectId} returnPassword
 * @returns {Promise<User>}
 */
const getUserById = async (id, returnPassword) => {
  return User.findById(id, returnPassword);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const updatedUser = await User.UpdateUser(userId, updateBody);
  return updatedUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.DeleteRecord({ id: user.id });
  return user;
};

/**
 * uddate user's password
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const UpdateUserPassword = async (userId, userBody) => {
  const user = await getUserById(userId, true);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  const newHashedPassword = await bcrypt.hash(userBody.newPassword, 8);
  if (user.password === hashedPassword) {
    await User.UpdateUser({ password: newHashedPassword });
    return true;
  }
  return false;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  UpdateUserPassword,
};
