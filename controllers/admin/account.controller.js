

// npm i md5 ==> mã hóa tin nhắn password
const md5 = require("md5");


const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

//[GET] /adim/accounts
module.exports.index = async (req, res, next) => {
   let find = {
      deleted: false
   }
   const records = await Account.find(find).select("-password -token");

   for (const record of records) {
      const role = await Role.findOne({
         _id: record.role_id,
         deleted: false
      });
      record.role = role;
   }

   res.render("admin/pages/accounts/index", {
      pageTitle: "Danh sách tài khoản",
      records: records
   });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {

   const roles = await Role.find({
      deleted: false
   });

   res.render("admin/pages/accounts/create", {
      pageTitle: "Thêm mới tài khoản",
      roles: roles
   });

};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {

   // check xem email exist chua
   const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false
   })

   if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
   }
   else {
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
   }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {

   let find = ({
      _id: req.params.id,
      deleted: false
   })

   try {
      const data = await Account.findOne(find);

      const roles = await Role.find({
         deleted: false,
      });

      res.render("admin/pages/accounts/edit", {
         pageTitle: "Chỉnh sửa tài khoản",
         data: data,
         roles: roles
      })

   } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/account`);
   }

}

// [PATH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {

   const id = req.params.id;

   // check xem email exist chua
   const emailExist = await Account.findOne({
      _id: { $ne : id}, //$ne là một toán tử được sử dụng trong các truy vấn để chỉ ra điều kiện "khác" (not equal). Khi sử dụng toán tử $ne, bạn có thể lọc ra các tài liệu mà giá trị của một trường không bằng một giá trị cụ thể nào đó.
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
//1:20




// req.params:
// req là đối tượng yêu cầu (request object) trong Express, chứa thông tin về request HTTP được gửi từ client đến server.

// req.params là một đối tượng chứa các tham số URL được định nghĩa trong route.
// Mỗi thuộc tính của req.params tương ứng với một tham số động trong URL.