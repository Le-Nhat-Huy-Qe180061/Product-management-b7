
//------------ MODELS ------------
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

//------------  END MODELS ------------

const filterStatusHelper = require("../../helpers/filterStatus");

const searchHelper = require("../../helpers/search");

const paginationHelper = require("../../helpers/pagination");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product
module.exports.index = async (req, res) => {
    // loc FilterStatus
    const filterStatus = filterStatusHelper(req.query);
    //    console.log(filterStatus);

    // console.log(req.query.status);
    let find = {
        // title: "iPhone X"
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    // find name from product
    //Tìm Kiếm
    const objectSearch = searchHelper(req.query);
    // console.log(objectSearch);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    //END Tìm Kiếm


    //Pagination
    //Tính tổng sản phẩm của mongo
    const countProducts = await Product.countDocuments(find);
    // let objectPagination = {
    //     currentPage: 1,
    //     limitItems: 4
    // }


    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    )

    // if(req.query.page)
    // {
    //     objectPagination.currentPage = parseInt(req.query.page);
    // }

    // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    // //Tính tổng sản phẩm của mongo
    // const countProducts = await Product.countDocuments(find);
    // const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
    // // console.log(totalPage);
    // objectPagination.totalPage = totalPage;
    // console.log(objectPagination.skip)

    // END Pagination 


    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc"
    }
    // END Sort

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort(sort);


    for (const product of products) {
        // lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        if (user) {
            product.accountFullName = user.fullName;
        }

        // lấy ra thông tin người cập nhập gần nhất
        const updatedBy = product.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })


            updatedBy.accountFullName = userUpdated.fullName;
        }
    }

    // nơi truyền ra bên ngoài giao diện pug
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATH] /admin/product/change-status/:status/:id
module.exports.changStatus = async (req, res) => {


    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
    });

    // res.send(`${status} - ${id}`);

    req.flash("success", "Cập nhập trạng thái thành công"); // flash rồi sang bên pug 
    res.redirect("back");

    //npm method-override
}

// [PATH]] /admin//change-multi
module.exports.changeMulti = async (req, res) => {

    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }


    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", `Cập nhập trạng thái thành công ${ids.length} sản phẩm`); // flash rồi sang bên pug 
            break;

        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", `Cập nhập trạng thái thành công ${ids.length} sản phẩm`); // flash rồi sang bên pug 
            break;

        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: "true",
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    }
                }
            );
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`); // flash rồi sang bên pug 
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, {
                    position: position,
                    $push: { updatedBy: updatedBy }
                })
                req.flash("success", `Cập nhập vịt trí thành công ${ids.length} sản phẩm`); // flash rồi sang bên pug 
            }
            break;
        default:
            break;
    }
    // dùng để ko bị reload lại trang web
    res.redirect("back");
}

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // xóa khỏi database
    // await Product.deleteOne({ _id: id});
    await Product.updateOne({ _id: id },
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            }
        }
    );
    req.flash("success", `Xóa thành công sản phẩm`); // flash rồi sang bên pug 

    res.redirect("back");
    //npm method-override
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    }

    const category = await ProductCategory.find(find);
  
    const newCategory = createTreeHelper(category);
  
    res.render("admin/pages/products/create", {
      pageTitle: "Thêm mới sản phẩm",
      category: newCategory
    });
  }

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    // console.log(req.file);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    //multer uploand file save
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // } ====> đã upload sửa bên router nên ko cần

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    // Save product
    const product = new Product(req.body);
    await product.save();

    /*Thuộc tính req.body chứa các cặp dữ liệu khóa-giá trị được gửi trong nội dung yêu cầu. */
    // console.log(req.body);
    req.flash("success", "Tạo sản phẩm thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    //Hàm res.redirect() chuyển hướng đến URL bắt nguồn từ đường dẫn đã chỉ định
};

// [Get] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);
        const category = await ProductCategory.find({
            deleted: false,
        });

        // const newCategory = createTreeHelper.tree(category);
        const newCategory = createTreeHelper(category);


        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {

    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);


    //  multer uploand file save
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    // mongoose queries
    try {

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        }); // đối tượng ob sẽ gửi lên 

        req.flash("success", "Cập nhập thành công");
    } catch (error) {
        req.errot("success", "Cập nhập thất bại!");
    }

    res.redirect("back");
};

// [Get] /admin/product/detail/:id
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}


// đầu tiên tạo nút bấm hay gì đấy
// bước tiếp theo tạo router
// bước 3 tạo controller lấy data render ra view

//router -> controller -> models -> data -> controller -> view