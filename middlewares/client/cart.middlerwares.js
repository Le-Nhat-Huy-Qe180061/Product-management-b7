const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if(!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();

    res.cookie("cartId", cart.id);
  } else {
    // tìm ra giỏ hàng
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0); // tỉnh tổng sản phẩm 

    console.log(cart)
    
    res.locals.miniCart = cart;
  }
  next();
}