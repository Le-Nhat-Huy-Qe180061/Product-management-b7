const { default: mongoose } = require("mongoose");

// SLUG
//npm i mongoose-slug-updater
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
  {
    title: String, // vd: sản phẩm 1 slug
    parent_id : {
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", //slug ăn theo cái title  ==> sản phẩm 1 slug
      unique: true // duy nhất ko cho trùng
    },
    deleted: {
      type: Boolean,
      // nếu người ta ko chuyền vào thì sẽ mặt định có giá trị default: false
      default: false
    },
    deletedAt: Date
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category"); // cái tham số thứ 3 là tên connection product trên mongodb

module.exports = ProductCategory;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis
