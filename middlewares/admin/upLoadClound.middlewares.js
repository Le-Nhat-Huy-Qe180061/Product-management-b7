
const uploadTocloudinary = require("../../helpers/uploadTocloudinary");

module.exports.upload = async (req, res, next) => {
    if (req.file) {
        const result = await uploadTocloudinary(req.file.buffer);
        req.body[req.file.fieldname] = result;
        // trách trường hợp nếu tên file khác nhau thì  ta sẽ lấy theoo biến name bên pug ảnh
        next();
    } else {
        next(); // để sang bước tiếp theo qua controller tránh trường hợp nếu người dùng ko upload ảnh cũng cho next
    }
}