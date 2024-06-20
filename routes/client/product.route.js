const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/product.controller");


// '/' là products rồi

router.get('/', controller.index);

router.get('/:slug', controller.detail);




module.exports = router;