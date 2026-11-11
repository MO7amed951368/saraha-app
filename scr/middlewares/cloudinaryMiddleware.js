import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (req, res, next) => {
  try {
    // If no file was uploaded in the request, move to the next middleware/controller
    if (!req.file) {
      return next();
    }

    // Convert the file buffer to a Base64 Data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'app_uploads', // Change folder name as needed
      resource_type: 'auto',  // Auto-detects image, video, or raw file
    });

    // Attach Cloudinary's response object to the request for your controller to use
    req.cloudinaryResult = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    next();
  } catch (error) {
    console.error('Cloudinary Middleware Error:', error);
    return res.status(500).json({ 
      error: 'Failed to upload file to cloud storage', 
      details: error.message 
    });
  }
};