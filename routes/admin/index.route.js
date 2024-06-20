
const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./products-category.route");
const rolesRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");


module.exports = (app) => {

    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);

    app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productCategoryRoutes);

    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, rolesRoute);

    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoute);

    app.use(PATH_ADMIN + "/auth", authRoute);

}