
const express = require('express');
const router = express.Router();

// npm i multer 
const multer = require("multer");

//old
// const storageMulter = require("../../helpers/storageMulter.js");
// const upload = multer({ storage: storageMulter() }); // dest: bắt đầu từ thư mục gốc
// END OLD
// new
const upload = multer(); // dest: bắt đầu từ thư mục gốc


//Controller
const controller = require("../../controllers/admin/product.controller");


//Validate
const validate = require("../../validates/admin/product.validate.js");

//Clound
const upLoadClound = require("../../middlewares/admin/upLoadClound.middlewares.js");


router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);


// Phương thức get mục đích để vẻ ra giao diện
// Khi gửi lên bằng p.thức post
router.get("/create", controller.create);

// multer --> thêm vào upload.single('thumbnail')
router.post(
    "/create",
    upload.single('thumbnail'),
    upLoadClound.upload,
    validate.createPost,
    controller.createPost
);

// :id có nghĩa là id động
router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('thumbnail'),
    upLoadClound.upload,
    validate.createPost,
    controller.editPatch
);



router.get("/detail/:id", controller.detail);


module.exports = router;