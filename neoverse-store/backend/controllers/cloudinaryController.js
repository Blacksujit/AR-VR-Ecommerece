const cloudinary = require('cloudinary').v2;
const { AppError } = require('../middleware/errorHandler');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file && !req.body.image) {
      return next(new AppError('No image provided', 400));
    }

    let result;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      result = await cloudinary.uploader.upload(dataUri, {
        folder: 'neoverse/products',
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, height: 1200, crop: 'limit' },
        ],
      });
    } else {
      result = await cloudinary.uploader.upload(req.body.image, {
        folder: 'neoverse/products',
        resource_type: 'image',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images provided', 400));
    }

    const results = await Promise.all(
      req.files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataUri = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'neoverse/products',
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, height: 1200, crop: 'limit' },
          ],
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    res.status(201).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return next(new AppError('Public ID is required', 400));
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const generateSignature = async (req, res, next) => {
  try {
    const { publicId, folder } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: publicId,
        folder: folder || 'neoverse/products',
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  generateSignature,
};
