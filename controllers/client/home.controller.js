
const ProductCategory = require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree");

const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");
// [GET] / 
module.exports.index =  async (req, res) => {
    // lấy ra sản phẩm nổi bật
    let find = {
        deleted: false,
        featured: "1",
        status: "active"
    };
    const productFeatured = await Product.find(find);
    const newProductsFeatured = productHelper.priceNewProducts(productFeatured);
    // END 

    // Hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position:"desc"}).limit(6);
    const newProductsNew = productHelper.priceNewProducts(productsNew);
    // END  


    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}


