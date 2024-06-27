


const Account = require("../../models/account.model");


// npm i md5 ==> mã hóa tin nhắn password
const md5 = require("md5");

//[GET] admin/my-account/
module.exports.index = (req, res, next) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin cá nhân",
    });
}

//[GET] admin/my-account/edit
module.exports.edit = (req, res, next) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân",
    });
}

//[PATH] admin/my-account/editPatch
module.exports.editPatch = async (req, res, next) => {

    const id = res.locals.user.id;

    // check xem email exist chua
    const emailExist = await Account.findOne({
        _id: { $ne: id }, //$ne là một toán tử được sử dụng trong các truy vấn để chỉ ra điều kiện "khác" (not equal). Khi sử dụng toán tử $ne, bạn có thể lọc ra các tài liệu mà giá trị của một trường không bằng một giá trị cụ thể nào đó.
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhập tài khoản thành công");
    }
    res.redirect("back");
}