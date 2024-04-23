const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const createStorage = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ["jpg", "png", "jpeg", "gif", "Webp"],
    },
  });

  return multer({ storage });
};

module.exports = createStorage;
