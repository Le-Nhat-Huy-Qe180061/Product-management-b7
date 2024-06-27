const { default: mongoose } = require("mongoose");

const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    }, // cũng giống id là duy nhất nhưng chỉ ai có tk ms có token này || khi người dùng đăng nhập thành công t ko lưu email password bên người dùng mà ta lưu token bên người dùng
    // mỗi lần người ta truy cập vào một trang private check xem có token này ko
    phone: String,
    avatar: String,
    status: {
        type: String,
        default: "active" //initial đang khởi tạo trước khi vào sau khi duyệt vào thành active
    },
    deleted: {
      type: Boolean,
      // nếu người ta ko chuyền vào thì sẽ mặt định có giá trị default: false
      default: false
    },
    deletedAt: Date
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema, "users"); // cái tham số thứ 3 là tên connection product

module.exports = User;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis
