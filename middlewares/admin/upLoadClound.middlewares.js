
// npm in cloudinary 
const cloudinary = require("cloudinary").v2;
// npm streamifier
const streamifier = require("streamifier");

// Cloundinary
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.CLOUND_KEY,
    api_secret: process.env.CLOUND_SECRET
});
// End Cloundinary
// dùng để uploand ảnh bên file pug admin/pages/products/create.pug bên fond-end


module.exports.upload = (req, res, next) => {
    if (req.file) {
        let stremUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        }
                        else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
                // buffer là kiu mã hóa nhị phân
            });
        };

        async function upload(req) {
            let result = await stremUpload(req);
            req.body[req.file.fieldname] = result.secure_url;
            // trách trường hợp nếu tên file khác nhau thì  ta sẽ lấy theoo biến name bên pug ảnh
            next();
        }
        upload(req);
    } else {
        next(); // để sang bước tiếp theo qua controller tránh trường hợp nếu người dùng ko upload ảnh cũng cho next
    }
}