const { request } = require("express");
const express = require("express");
const multer = require("multer");
const router = express.Router()

const upload = multer();

//Clound
const upLoadClound = require("../../middlewares/admin/upLoadClound.middlewares.js");

const controller = require("../../controllers/admin/my-account.controller");


router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch("/edit", 
    upload.single('avatar'), // lấy từ ô input
    upLoadClound.upload,
    controller.editPatch
);
/// 1h 04


module.exports = router;