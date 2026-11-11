import cloudinary from '../config/cloudinary.js';

export const uploadMultipleToCloudinary = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return next();
    }

    // Upload all file buffers to Cloudinary concurrently
    const uploadPromises = files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      let dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'profile_covers', // Change folder name as needed
        resource_type: 'auto',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    });

    const cloudinaryResults = await Promise.all(uploadPromises);

    // Attach the array of URLs and IDs to req so the controller can access them
    req.cloudinaryResults = cloudinaryResults;

    next();
  } catch (error) {
    console.error('Cloudinary Multiple Upload Error:', error);
    return res.status(500).json({ 
      error: 'Failed to upload cover pictures to cloud storage', 
      details: error.message 
    });
  }
};  