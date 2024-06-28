
const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");


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


// [POST] /user/LoginPost
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

// [GET] /user/Logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
}


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  console.log(req.body.email);
  // B1 check có kiểm tra có đúng thật email tồn tại trong database hay ko
  const email = req.body.email;

  const otp = generateHelper.generateRandomNumber(8);

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  // B2 Tạo mã OTP và lưu thông tin yêu cầu vào collection
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  // B2.1 Lưu vào trong database

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // B2 Gửi mã OTP qua email của user

  

  res.redirect(`/user/password/otp?email=${email}`); //gửi email lên trên url để ta biết forcus vào email đấy
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {

  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
}

// [POST] /user/password/otpPasswordPost
module.exports.otpPasswordPost = async (req, res) => {

  const email = req.body.email;
  const otp = req.body.otp;

  console.log({
    email: email,
    otp: otp
  })

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp, // xác thực đc opt đúng của user
  })

  console.log(result);

  if (!result) {
    req.flash("error", "OTP Không hợp lệ");
    res.redirect("back");
    return;
  }

  // bài toán ở đây sau khi người ta nhập mật khẩu mới gửi lên thì cái mk đấy có phải
  // do chính ông user ấy gửi lên hay không ==> vì thế chúng ta phải có 1 cái gì đấy để xác thực thêm bước nửa 
  // vì một người khác có thể khi chúng ta gửi lên một cái email password ms họ có thể fake đc
  // vì vậy ta sẽ lưu cái token của họ

  const user = await User.findOne({
    email: email,
  })

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {

  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser; // lấy ra  đc key thì bt đc cập nhập cho user nào

  await User.updateOne({
    tokenUser: tokenUser, // ĐK xem thử có cùng token hay ko
  }, {
    password: md5(password)
  })

  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("/");
}




