const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // dest: bắt đầu từ thư mục gốc


//Clound
const upLoadClound = require("../../middlewares/admin/upLoadClound.middlewares.js");

const controller = require("../../controllers/admin/setting.controller");


router.get("/general", controller.general);

router.patch(
    "/general", 
    upload.single('logo'),
    upLoadClound.upload,
    controller.generalPatch
);



module.exports = router;