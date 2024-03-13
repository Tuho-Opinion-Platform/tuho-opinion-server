const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folderName = 'gallery'; // Default folder
    let resourceType = 'auto'; // Let Cloudinary decide based on the file format for images and videos

    if (file.mimetype.startsWith('video/')) {
      folderName = 'video-gallery'; // A specific folder for videos
    } else if (file.mimetype.startsWith('image/')) {
      folderName = 'photo-gallery'; // A specific folder for images
    } else if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      folderName = 'documents'; // A specific folder for documents
      resourceType = 'raw'; // For PDF and Word documents, use 'raw' as they are not images or videos
    }

    return {
      folder: folderName,
      // Do not use allowed_formats for raw file types as it's not applicable
      resource_type: resourceType,
    };
  },
});


module.exports = multer({ storage });