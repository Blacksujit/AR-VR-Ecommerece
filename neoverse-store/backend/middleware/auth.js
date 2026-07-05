const { createClerkClient, verifyToken: clerkVerifyToken } = require('@clerk/backend');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function findOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (user) return user;

  let email = `${clerkId}@neoverse.app`;
  let name = 'User';
  let avatar = '';
  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);
    email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || email;
    name = clerkUser.fullName || clerkUser.firstName || name;
    avatar = clerkUser.imageUrl || '';
  } catch (err) {
    console.warn(`[Auth] Could not fetch Clerk user ${clerkId}:`, err.message);
  }

  user = await User.create({
    clerkId,
    name,
    email,
    avatar,
    role: 'user',
    wishlist: [],
    addresses: [],
  });
  console.log(`[Auth] Created MongoDB user ${user._id} for clerkId ${clerkId}`);
  return user;
}

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(new AppError('Authentication required. Please sign in.', 401));
    }

    const { sub } = await clerkVerifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    req.user = await findOrCreateUser(sub);
    next();
  } catch (error) {
    console.error(`[Auth] Token verification failed:`, error.name || '', error.message || error, error.status ? `status=${error.status}` : '', error.reason ? `reason=${error.reason}` : '');
    if (error.status === 401) {
      return next(new AppError('Session expired. Please sign in again.', 401));
    }
    return next(new AppError('Invalid authentication token', 401));
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const { sub } = await clerkVerifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      req.user = await findOrCreateUser(sub);
    }
  } catch {
    // Silently continue without auth
  }
  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Admin access required', 403));
};

module.exports = { protect, optionalAuth, admin };
