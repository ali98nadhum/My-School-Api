const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../config/prismaClient");
const { hashPassword } = require("../../utils/hashPassword");
const { generateToken, generateRefreshToken, REFRESH_TOKEN_EXPIRES_DAYS } = require("../../utils/Auth/generateToken");
const { ApiError } = require("../../utils/ApiError");




