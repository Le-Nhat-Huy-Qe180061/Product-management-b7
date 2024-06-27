
const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const Cart = require("../../models/cart.model");


// [GET] /user/register
module.exports.register = async (req, res) => {

  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
}


// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const userInfo = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    tokenUser: generateHelper.generateRandomString(30)
  }

  const user = new User(userInfo);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
}


// [GET] /user/Login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });

  // lenhathuy9a6@gmail.com 
  // 123456
}


// [GET] /user/LoginPost
module.exports.loginPost = async (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  if (user.email == email && user.password == password) {
    req.flash("success", "Đăng nhập thành công");
  }

  // Cập nhật thông tin giỏ hàng với user_id.
  // Thiết lập cookie chứa token của người dùng.
  // Cập nhật trạng thái người dùng thành "online".
  // Phát sóng trạng thái trực tuyến của người dùng tới các kết nối socket khác.

  await Cart.updateOne({
    _id: req.cookies.cartId
  }, {
    user_id: user.id
  });

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
}

