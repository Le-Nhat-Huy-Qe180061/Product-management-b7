const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");

const searchHelper = require("../../helpers/search");

const paginationHelper = require("../../helpers/pagination");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);

    // console.log(objectSearch);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    //Pagination
    //Tính tổng sản phẩm của mongo
    const countProductsCategory = await ProductCategory.countDocuments(find);
    // let objectPagination = {
    //     currentPage: 1,
    //     limitItems: 4
    // }

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 3
        },
        req.query,
        countProductsCategory
    )


    const records = await ProductCategory.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    const newRecords = createTreeHelper.tree(records);

    // nơi truyền ra bên ngoài giao diện pug
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        keyword: objectSearch.keyword,
        filterStatus: filterStatus,
        pagination: objectPagination
    });
}

// [PATH] /admin/product-category/change-status/:status/:id
module.exports.changStatus = async (req, res, next) => {
    // console.log(req.params);

    const status = req.params.status;
    const id = req.params.id;

    console.log(status);
    console.log(id);

    await ProductCategory.updateOne(
        { _id: id },
        { status: status }
    );

    res.redirect("back");
}

// [PATH] /admin/change-multi
module.exports.changeMulti = async (req, res, next) => {

    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;

        default:
            break;
    }


    res.redirect("back");

}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }


    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    // console.log(records);
    console.log(newRecords);

    // nơi truyền ra bên ngoài giao diện pug
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}


// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {

    console.log(req.body);
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments(); // đếm trong cái ProductCategory có bao nhiêu bản ghi
        req.body.position = countProducts + 1; // xong update lên 1 đơn vị
    }
    else {
        req.body.position = parseInt(req.body.position); // lấy theo trường hợp nhập
    }

    // Save product
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};


// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {

    // try cath để tránh trường hợp chết code khi người dùng sửa url id sản phẩm
    // nếu ko tìm đc danh mục thì sẽ redirect lại trang
    try {
        //b1 lấy query id 
        //b2 kết nối data 
        //b3 có data rồi đổ ra views

        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        })
        const records = await ProductCategory.find({
            deleted: false
        });
        const newRecords = createTreeHelper.tree(records);
        // nơi truyền ra bên ngoài giao diện pug
        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [Path] /admin/product-category/edit/:id
module.exports.editPath = async (req, res) => {


    const id = req.params.id;

    req.body.position = parseInt(req.body.position); // cập nhập lại vị trí là số nguyên

     // mongoose queries
     try {
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhập thành công");
    } catch (error) {
        req.errot("success", "Cập nhập thất bại!");
    }
    res.redirect("back");
}

// [Get] /admin/product-category/detail/:id
module.exports.detail = async (req, res, next) => {


    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const record = await ProductCategory.findOne(find);


        res.render("admin/pages/products-category/detail", {
            pageTitle: record.title,
            record: record,
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [Get] /admin/product-category/delete/:id
module.exports.deleteItem = async (req, res, next) => {

    const id = req.params.id;
    
    await ProductCategory.updateOne({_id:id}, {
        deleted: true,
        deletedAt: new Date()
    });

    req.flash("success", `Xóa thành công sản phẩm`);

    res.redirect("back");

}