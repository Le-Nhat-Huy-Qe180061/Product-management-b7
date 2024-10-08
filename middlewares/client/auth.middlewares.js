
const User = require("../../models/user.model");


module.exports.requireAuth = async (req, res, next) => {

    if(!req.cookies.tokenUser){
        res.redirect(`/user/login`);
        return;
    }

    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
        status: "active"
    })

    if(!user){ // trường hợp người dùng tự thêm token cookies vào 
        res.clearCookie("tokenUser");    
        res.redirect(`/user/login`);
        return;    
    }

    next();
}