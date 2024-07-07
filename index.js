
const express = require('express');

//method-override
const methodOverride = require("method-override");

//body-parser
const bodyParser = require('body-parser');

//express-flash : hiển thị thông báo
var flash = require('express-flash');
require('dotenv').config();

//socket.io
const http = require("http");
const {Server} = require("socket.io");
//END socket.io

//---------- ROUTE ----------
// Client
const route = require("./routes/client/index.route");

//  ADMIN 
const routeAdmin = require("./routes/admin/index.route");

//---------- END ROUTE ----------

const systemConfig = require("./config/system");

//Database
const database = require("./config/database");
database.connect();
//-----------------End Database-----------------

// express-flash
const cookieParser = require("cookie-parser");
const session = require('express-session');
const { patch } = require('./routes/admin/dashboard.route');
//END express-flash

const app = express(); // gọi hàm tạo cái app cho ta dùng và là toàn bộ chương trình của ta
const port = process.env.PORT;


// TinyMCE
const path = require('path');

// npm i moment để chuẩn hóa thời gian
const moment = require("moment");

//method-override use
app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`); // vercel
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`)); // vercel

//Socket.io
const server = http.createServer(app); // Tạo ra server 
const io = new Server(server);
global._io = io; // Tạo biến toàn cục dùng ở bất kỳ đâu ở trong app
 // sau khi cài server thì đổi app listen bằng server để kết hợp

// express-flash
app.use(cookieParser('huykute'));
//install cookie-parser để thêm thư viện cookieParser
app.use(session({ cookie: { maxAge: 60000 } }));

//npm i express-session
app.use(flash());
//END express-flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// END TinyMCE


// APP-locals-varibale
//Biến này chỉ đc dùng trong file pug 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//moment use
app.locals.moment = moment;


//Route
route(app);
routeAdmin(app);



server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});