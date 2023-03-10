const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + ".jpg");
    },
  }),
}).single("user_file");

module.exports = upload;
