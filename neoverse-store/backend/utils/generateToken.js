const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY_DAYS = 7;

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });
};

const generateRefreshTokenValue = () => {
  return crypto.randomBytes(40).toString('hex');
};

const getRefreshExpiryDate = () => {
  return new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
};

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});

const getAccessCookieOptions = () => ({
  ...getCookieOptions(),
  maxAge: 15 * 60 * 1000,
});

const getRefreshCookieOptions = () => ({
  ...getCookieOptions(),
  maxAge: REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
});

module.exports = {
  generateAccessToken,
  generateRefreshTokenValue,
  getRefreshExpiryDate,
  getAccessCookieOptions,
  getRefreshCookieOptions,
};
