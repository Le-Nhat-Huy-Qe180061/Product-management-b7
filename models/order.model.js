const { default: mongoose } = require("mongoose");



const orderSchema = new mongoose.Schema(
  {
    cart_id: String, //dùng để bên trang client liệt kê lại tất cả các đơn hàng đã đặt
    userInfo: {
        fullName: String,
        phone: String,
        address: String
    },
    products: [
        {
            product_id: String, // biết id sản phẩm đã đặt để truy vấn lại thông tin sản phẩm đó
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
    ]
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema, "orders"); // cái tham số thứ 3 là tên connection product

module.exports = Order;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis
