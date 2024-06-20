// validate như vai trò trung gian để thỏa mản đk thì ms đi tiếp


module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", `Vui lòng nhập đầy đủ!`);
        res.redirect("back");
        return;
    }

    next(); // khi thỏa mản đk trên thì sẽ next sang bước kế tiếp
}