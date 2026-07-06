const path = require('path');
const { initializeApp, getApps, cert, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

if (getApps().length === 0) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountPath) {
    const resolvedPath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.join(__dirname, '..', serviceAccountPath);
    const serviceAccount = require(resolvedPath);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } else if (serviceAccountKey) {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountKey, 'base64').toString()
    );
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId: 'ar-vr-ecommerce-c84b0',
    });
  }
}

const auth = getAuth();

async function findOrCreateUser(firebaseUid) {
  let user = await User.findOne({ firebaseUid }).collation({ locale: 'en', strength: 2 });
  if (user) return user;

  let email = `${firebaseUid}@neoverse.app`;
  let name = 'User';
  let avatar = '';
  let phone = '';

  try {
    const firebaseUser = await auth.getUser(firebaseUid);
    email = firebaseUser.email || email;
    name = firebaseUser.displayName || name;
    avatar = firebaseUser.photoURL || '';
    phone = firebaseUser.phoneNumber || '';
  } catch (err) {
    console.warn(`[Auth] Could not fetch Firebase user ${firebaseUid}:`, err.message);
  }

  user = await User.create({
    firebaseUid,
    name,
    email,
    avatar,
    phone,
    role: 'user',
    wishlist: [],
    addresses: [],
  });
  console.log(`[Auth] Created MongoDB user ${user._id} for firebaseUid ${firebaseUid}`);
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

    const decoded = await auth.verifyIdToken(token);
    req.user = await findOrCreateUser(decoded.uid);
    req.firebaseUid = decoded.uid;
    next();
  } catch (error) {
    console.error(`[Auth] Token verification failed:`, error.code || error.message);
    if (error.code === 'auth/id-token-expired') {
      return next(new AppError('Session expired. Please sign in again.', 401));
    }
    return next(new AppError('Invalid authentication token', 401));
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = await auth.verifyIdToken(token);
      req.user = await findOrCreateUser(decoded.uid);
      req.firebaseUid = decoded.uid;
    }
  } catch {
    // Silently continue without auth
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Admin access required', 403));
};

module.exports = { protect, optionalAuth, admin: adminOnly };
