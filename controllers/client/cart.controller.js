


const Cart = require("../../models/cart.model");

const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");

// [GET] /cart/
module.exports.index = async (req, res) => {

    const cartId = req.cookies.cartId; // lấy ra giỏ hàng 


    const cart = await Cart.findOne({
        _id: cartId,
    })

    if (cart.products.length > 0) {
        for (const item of cart.products) { //item chính là các ob trong giỏ hàng
            const productId = item.product_id;

            const productInfo = await Product.findOne({
                _id: productId
            })

            productInfo.priceNew = productHelper.priceNewProduct(productInfo);

            item.productInfo = productInfo; // lấy ra thông tin products

            item.totalPrice = item.quantity * productInfo.priceNew;
            // tổng tiền của giá nhân với sô lượng
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    // console.log(cart);

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

// [POST] /cart/add/:productId 
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const quantity = parseInt(req.body.quantity);
    const productId = req.params.productId;

    // console.log(cartId);
    // console.log(quantity);
    // console.log(productId);

    const cart = await Cart.findOne({
        _id: cartId
    })

    // console.log(cart.products);

    const existProductInCart = cart.products.find(item => item.product_id == productId);

    // console.log(existProductInCart);

    try {
        if (existProductInCart) {
            console.log("cập nhập Quantity");

            const newQuantity = quantity + existProductInCart.quantity;

            await Cart.updateOne(
                {
                    _id: cartId,
                    "products.product_id": productId
                },
                {
                    "products.$.quantity": newQuantity
                }
            )
        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity,
            };
            await Cart.updateOne({
                _id: cartId
            }, {
                $push: { products: objectCart }
            });
        }
        req.flash("success", "Đã thêm sản phẩm vào giỏ hàng.");
    } catch (error) {
        req.flash("error", "Thêm sản phầm vào giỏ hàng không thành công!.");
    }
    res.redirect("back");
}



// [GET] /deleted/:productId
module.exports.delete = async (req, res) => {

    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    // stack-overflow How to remove object from array using mongoose
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            "$pull": { products: { "product_id": productId } }
        }
    );

    // console.log(productId);
    // console.log("-----------------")

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
    res.redirect("back")
}

// [GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;


    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            "products.$.quantity": quantity
        }
    )

    // console.log(productId);
    // console.log("-----------------")

    req.flash("success", "Đã cập nhập số lượng!");
    res.redirect("back")
}