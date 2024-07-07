const express = require("express");
const multer = require("multer");
const upload = multer(); // dest: bắt đầu từ thư mục gốc
const router = express.Router();
//Clound
const upLoadClound = require("../../middlewares/admin/upLoadClound.middlewares.js");
//Validate
const validate = require("../../validates/admin/account.validate.js");

const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
    upload.single('avatar'),
    upLoadClound.upload,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single('avatar'),
    upLoadClound.upload,
    validate.editPatch,
    controller.editPatch
);

module.exports = router;