const multer = require("multer");
const path = require("path");

const fileName = ["application/pdf"];

const upload = (dest, name) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(`${__dirname}`, `/../public/${dest}`));
    },
    filename: (req, file, cb) => {
      let filename = "";

      if (fileName.includes(file.mimetype)) {
        const mime = file.mimetype.split("/");
        const extension = mime[mime.length - 1];
        filename = `${name}_${Date.now()}.${extension}`;
      }

      cb(null, filename);
    },
  });

  return storage;
};

module.exports = upload;
