
const express = require('express');
const multer = require("multer");
const router = express.Router();

// npm i multer 

const upload = multer(); // dest: bắt đầu từ thư mục gốc

//Controller
const controller = require("../../controllers/admin/product-category.controller");

//Validate
const validate = require("../../validates/admin/product-category.validate");

//Clound
const upLoadClound = require("../../middlewares/admin/upLoadClound.middlewares");

//


router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single('thumbnail'),
    upLoadClound.upload,
    validate.createPost,
    controller.createPost
);
//------------------
router.patch("/change-status/:status/:id", controller.changStatus);
//------------------
router.patch("/change-multi", controller.changeMulti);
//------------------
router.get("/detail/:id", controller.detail);
//------------------
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single('thumbnail'),
    upLoadClound.upload,
    validate.createPost,
    controller.editPath
)
//------------------
router.delete("/delete/:id", controller.deleteItem);



module.exports = router;