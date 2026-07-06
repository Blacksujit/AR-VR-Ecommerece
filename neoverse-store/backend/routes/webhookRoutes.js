const express = require('express');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

router.use((req, res, next) => {
  next(new AppError('Not found', 404));
});

module.exports = router;
