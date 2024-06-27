

const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");


//[GET] /adim/roles
module.exports.index = async (req, res, next) => {
   let find = {
      deleted: false
   }
   const record = await Role.find(find);

   // console.log(record);

   res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm quyền",
      records: record
   });
}


//[GET] /adim/roles/create
module.exports.create = async (req, res, next) => {

   res.render("admin/pages/roles/create", {
      pageTitle: "Tạo nhóm quyền",
   });

}

//[Post] /adim/roles/create
module.exports.createPost = async (req, res, next) => {

   // console.log(req.body);
   try {
      const record = new Role(req.body);
      await record.save();
      req.flash("success", "Tạo thành công");
   } catch (error) {
      req.flash("error", "Tạo không thành công!");
   }
   
   res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

//[GET] /adim/roles/edit/:id
module.exports.edit = async (req, res, next) => {
   try {
      const id = req.params.id;
      let find = {
         _id: id,
         deleted: false
      }
      const data = await Role.findOne(find);
      res.render("admin/pages/roles/edit.pug", {
         pageTitle: "Chỉnh sửa Phân quyền",
         data: data
      });
   } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/roles`);
   }
};

//[POST] /adim/roles/editPost/:id
module.exports.editPath = async (req, res, next) => {

   try {
      const id = req.params.id;

      req.flast("success", "Cập nhập quyền thành công");

      await Role.updateOne({ _id: id }, req.body);

      res.redirect("back");
   } catch (error) {
      req.flash("error", "Cập nhập quyền thất bại !");
   }

};


//[GET] /adim/roles/permissions
module.exports.permissions = async (req, res, next) => {

   let find = {
      deleted: false
   }

   const records = await Role.find(find);

   res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records
   })

};


//[PATH] /adim/roles/permissionsPath
module.exports.permissionsPath = async (req, res, next) => {
   // bất cứ thứ gì gửi chúng ta gửi qua thông qua cái form thì tất cả các input trong data 
   // đều lấy thông qua req.body
   try {
      const permissions = JSON.parse(req.body.permissions); //chuyển từ json --> js
      for (const item of permissions) {
         await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
      }
      req.flash("success", "cập nhập phân quyền thành công!"); // flash rồi sang bên pug 
      res.redirect("back");
   } catch (error) {
      req.flash("error", "cập nhập phân quền failer!!!"); // flash rồi sang bên pug 
   }
};