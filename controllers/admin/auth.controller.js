

const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");


// npm i md5 ==> mã hóa tin nhắn password
const md5 = require("md5");

//[GET] /admin/auth/login
module.exports.login = async (req, res, next) => {
    if (req.cookies.token) { // nếu đã tồn tại cookie mà người dùng sửa trên url thì sẽ chuyển hướng sang dashboard
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập"
        });
    }

}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    })

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

    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);

    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}



//[GET] /admin/auth/logout
module.exports.logout = async (req, res, next) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}