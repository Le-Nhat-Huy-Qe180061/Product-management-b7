
const SettingGeneral = require("../../models/settings-general.model");



//[GET] /adim/settings/general
module.exports.general = async (req, res, next) => {

   const settingGeneral = await SettingGeneral.findOne({}); // tìm đc bản nghi đầu tiên rồi lưu bản nghi đầu tiên

   console.log(settingGeneral);

   res.render("admin/pages/settings/general", {
      pageTitle: "Cài đặt chung",
      settingGeneral: settingGeneral
   })
};



//[PATCH] /adim/settings/general
module.exports.generalPatch = async (req, res, next) => {
   console.log(req.body);


   const settingGeneral = await SettingGeneral.findOne({}); 

   if (settingGeneral) {
      await SettingGeneral.updateOne(
         {
            _id: settingGeneral.id
         }, req.body)
   } else {
      const record = new SettingGeneral(req.body);
      await record.save();
   }

   req.flash("success", "Cập nhập thành công")
   res.redirect("back");
};