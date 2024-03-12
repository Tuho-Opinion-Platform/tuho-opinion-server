// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     allowed_formats: ["jpg", "png", "webp"],
//     folder: "photo-gallery"// The name of the folder in cloudinary
//     // resource_type: "raw", // => this is in case you want to upload other types of files, not just images
//   }
// });

// module.exports = multer({ storage });

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
    let resourceType = 'auto'; // Let Cloudinary decide based on the file format
    let allowedFormats = ['jpg', 'png', 'webp', 'mp4', 'avi', 'webm', 'mov']; // Example formats

    // Optionally, you can adjust the folder name or other parameters based on the file type or other criteria
    if (file.mimetype.startsWith('video/')) {
      folderName = 'video-gallery'; // A specific folder for videos
    } else if (file.mimetype.startsWith('image/')) {
      folderName = 'photo-gallery'; // A specific folder for images
    }

    return {
      folder: folderName,
      allowed_formats: allowedFormats,
      resource_type: resourceType,
    };
  },
});

module.exports = multer({ storage });