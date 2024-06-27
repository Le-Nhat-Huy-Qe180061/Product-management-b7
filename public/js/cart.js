
// Cập nhập số lượng sản phẩm 
console.log("ok");
const inputsQuantity = document.querySelectorAll("input[name='quantity']"); //[thuộc tính] tìm theo thuộc tính thêm nữa
if (inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            // console.log(input); // trả về ô input
            // console.log(e); // trả về ob lấy ra các giá trị
            // console.log(e.target.value);

            const productId = input.getAttribute("product-id");
            const quantity = parseInt(input.value);

            if (quantity > 0) {
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }
        })
    })
}
// End Cập nhập số lượng sản phẩm 
