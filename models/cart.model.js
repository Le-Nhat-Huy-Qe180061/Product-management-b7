const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
        {
            product_id: String,
            quantity: Number
        }
    ]
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema, "carts"); // cái tham số thứ 3 là tên connection product

module.exports = Cart;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis
