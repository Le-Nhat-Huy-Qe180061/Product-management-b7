const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String, // vd: sản phẩm 1 slug
    description: String,
    permissions:{
      type: Array,
      default: []
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

const Role = mongoose.model("Roles", roleSchema, "roles"); // cái tham số thứ 3 là tên connection product

module.exports = Role;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis
