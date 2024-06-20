

// Change Stauts
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {

    const formchangeStatus = document.querySelector("#form-change-status");
    const path = formchangeStatus.getAttribute("data-path");
    // console.log(path);

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            // console.log(statusCurrent);
            // console.log(id);
            // console.log(statusChange);

            const action = path + `${statusChange}/${id}?_method=PATCH`; //?_method=PATCH` của method-override bên form method phải luôn luôn để post
            console.log(action);

            formchangeStatus.action = action;

            //sau khi xong rồi ta gọi hàm sumbit để gọi lên 
            formchangeStatus.submit();

        });
    });
}
// END Change Stauts

// Delete itme 
const buttonsDelete = document.querySelectorAll("[button-delete]");

if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này ?");

            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DELETE`; //?_method=PATCH` của method-override bên form method phải luôn luôn để post

                // console.log(action);

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}
// END Delete item 