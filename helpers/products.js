
module.exports.priceNewProducts = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0); // ct tính số trang
        return item;
    });

    return newProducts;
} 

// tính 1 sản phẩm
module.exports.priceNewProduct = (products) => {
    const priceNew = ((products.price * (100 - products.discountPercentage)) / 100).toFixed(0);

    return priceNew;
} 