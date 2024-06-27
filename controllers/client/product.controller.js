


const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");


const productHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");


// [GET] products
module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    // console.log(products);

    // products.forEach(item => {
    //     item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
    // })

    const newProducts = productHelper.priceNewProducts(products);
    // toFixed để làm tròn ko lấy số thập phân đằng sau 

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });

}

// [GET] products/:slugProduct
module.exports.detail = async (req, res) => {

    // console.log(req.params.slugProduct);

    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct, // ta sẽ lấy ra cái slug của sản phầm chứ ko đc lấy id
            status: "active" // để tránh trường hợp có người search lấy ra được data
        }
        const product = await Product.findOne(find);


        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })

            product.category = category;
        }

       product.priceNew = productHelper.priceNewProduct(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/products`);
    }


}


// [GET] products/:SlugCategory
module.exports.category = async (req, res) => {

    // console.log(req.params.slugCategory);

    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })
    const listSubCategory = await productsCategoryHelper.getSubcategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false
    }).sort({ position: "desc" });

    // console.log(products);

    
    const newProducts = productHelper.priceNewProducts(products);


    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    })
}




/*
Khi bạn truy cập vào một trang web thì trình duyệt sẽ request (yêu cầu)
đến server làm các tác vụ mà bạn yêu cầu và sau khi xử lý hành động server
sẽ phản hồi (response) lại cho người dùng. 
 */

/*
Request Object trong Express.js cho phép bạn kiểm tra mọi khía cạnh về yêu cầu mà người dùng (client) 
gửi đến server(cho dù bằng trình duyệt, bằng cURL hoặc trình duyệt di động, v.v.). 
Trong request object bao gồm rất nhiều thứ như url, method, form data, header,...
Khi bạn khởi tạo một route khi người dùng (client) truy cập đồng nghĩa với việc người dùng đã gửi cho ứng dụng Express một Request.
*/

/* 
Các thuộc tính có trong req ob:
+req.body:Nó chứa key - value dữ liệu được gửi đến bởi client. 
Mặc định, nó có giá trị là undefined, và thông thường được gán gía trị 
khi ta parse body bằng middleware body-parse.

+req.params: Một object chứa các thuộc tính cho việc định danh route. 
Ví dụ bạn có một route là /posts/:postID, 
khi truy cập vào đường dẫn /posts/123 thì để lấy giá trị của postID bạn chỉ cần lấy bằng cách req.params.postID
*/

/*
 Response Object trong Express thường được viết tắt là res, 
 nó cung cấp cho bạn một cách thức đơn giản để phản hồi các yêu cầu HTTP.
 
 +res.send: có lẽ là phương thức nổi tiếng nhất được sử dụng trên res. Với res.send () bạn có thể trả lời các yêu cầu HTTP với tất cả các loại dữ liệu
 +res.json: Phương thức này sẽ phản hồi về dạng json
 +res.status: Chỉ định mã phản hồi HTTP, status thể hiện trạng thái của phàn hổi.
 +res.redirect: Bạn có thể chuyển hướng khách hàng đến các route trong ứng dụng hoặc đến các trang web khác nhau:

*/

