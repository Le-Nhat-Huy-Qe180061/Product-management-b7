
const mongoose = require("mongoose");
//connect mongoos
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Giảm thời gian chờ để thử lại kết nối
            socketTimeoutMS: 45000 // Tăng thời gian chờ để xử lý yêu cầu 
         } ;
        console.log("Connect Success!");
    } catch (error) 
    {
        console.log("Connect Errot!");
    }
}


// mongoose.connect('mongodb://username:password@host:port/database', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000, // Giảm thời gian chờ để thử lại kết nối
//     socketTimeoutMS: 45000 // Tăng thời gian chờ để xử lý yêu cầu 
//  });