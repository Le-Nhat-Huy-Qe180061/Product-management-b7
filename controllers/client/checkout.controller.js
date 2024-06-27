
const Cart = require("../../models/cart.model");

const Product = require("../../models/product.model");

const Order = require("../../models/order.model");

const productHelper = require("../../helpers/products");


// [GET] /checkout
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
    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id: cartId,
    })

    let products = [];

    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id, // biết id sản phẩm đã đặt để truy vấn lại thông tin sản phẩm đó
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        }

        const productInfo = await Product.findOne({
            _id: product.product_id
        });

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct);
    }

    // ORDER
    const objectOrder = {
        cart_id: cartId, //dùng để bên trang client liệt kê lại tất cả các đơn hàng đã đặt
        userInfo: userInfo,
        products: products,
    }

    const order = new Order(objectOrder);
    
    await order.save();

    await Cart.updateOne({  // sau khi khánh hàng đặt hàng xong thì reset giỏ hàng lại về 0
        _id: cartId
    }, {
        products: [],
    })


    res.redirect(`/checkout/success/${order.id}`);

}

// [GET] /checkout/success/:id
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      _id:req.params.orderId
    });

    console.log(order);
    console.log("-------------")
 
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id // lấy thông tin sản phẩm trong trường products
        }).select("title thumbnail");

        product.productInfo = productInfo;

        product.priceNew = productHelper.priceNewProduct(product);

        product.totalPrice = product.priceNew * product.quantity;
    }



    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice,0);

    console.log(order);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order,
    });
}

