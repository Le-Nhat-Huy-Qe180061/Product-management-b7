

module.exports.createPost = (req, res, next) => {

    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tiêu đề!");
        res.redirect("back");
        return;
    }

    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email!");
        res.redirert("back");
        return;
    }

    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập password!");
        res.redirect("back");
        return;
    }
    next();
}


module.exports.editPatch = (req, res, next) => {

    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tiêu đề!");
        res.redirect("back");
        return;
    }

    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email!");
        res.redicect("back");
        return;
    }

    next();
}