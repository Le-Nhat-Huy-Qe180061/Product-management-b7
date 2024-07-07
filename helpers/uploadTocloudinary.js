

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


let stremUpload = (buffer) => {
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
        streamifier.createReadStream(buffer).pipe(stream);
        // buffer là kiu mã hóa nhị phân
    });
};



module.exports.uploadTocloudinary = async (buffer) => {
    let result = await stremUpload(buffer);
    return result.url;
}
