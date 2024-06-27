const { default: mongoose } = require("mongoose");

// SLUG
//npm i mongoose-slug-updater
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String, // vd: sản phẩm 1 slug
    product_category_id: { // tạo như này do lúc nào cũng ko phải có data truyền vào 
      type: String,
      default: "" // nếu ko truyền vao là string rổng
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: {
      type: String,
      default: "0"
    },
    position: Number,
    slug: {
      type: String,
      slug: "title", //slug ăn theo cái title  ==> sản phẩm 1 slug
      unique: true // duy nhất ko cho trùng
    },
    createdBy: {
      account_id: String,
      createAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: {
      type: Boolean,
      // nếu người ta ko chuyền vào thì sẽ mặt định có giá trị default: false
      default: false
    },
    // deletedAt: Date,
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [ // dùng mãng để push vào để ko mất phần tử cũ
      {
        account_id: String,
        updatedAt: Date
      }
    ],
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema, "products"); // cái tham số thứ 3 là tên connection product

module.exports = Product;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis
