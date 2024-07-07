const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");

const checkoutRoutes = require("./checkout.route");

const cartMiddleware = require("../../middlewares/client/cart.middlerwares");

const categoryMiddleware = require("../../middlewares/client/category.middlerwares");

const cartRoutes = require("./cart.route");

const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/client/auth.middlewares");

const userMiddleware = require("../../middlewares/client/user.middlewares");

const settingMiddleware = require("../../middlewares/client/setting.middleware");

// chat
const chatRoutes = require("./chat.route");

module.exports = (app) => {

    app.use(categoryMiddleware.category);

    app.use(cartMiddleware.cartId);

    app.use(userMiddleware.infoUser);

    app.use(settingMiddleware.settingGeneral);

    app.use('/', homeRoutes);
    app.use("/products", productRoutes);
    app.use("/search", searchRoutes);
    app.use("/cart",  authMiddleware.requireAuth, cartRoutes);
    app.use("/checkout",  authMiddleware.requireAuth, checkoutRoutes);
    app.use("/user", userRoutes);

    app.use("/chat", authMiddleware.requireAuth, chatRoutes);

}