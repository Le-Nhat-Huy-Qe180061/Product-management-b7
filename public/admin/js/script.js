// Button status 
const buttonStatus = document.querySelectorAll("[button-status]");
// console.log(buttonStatus);

// Kiểm tra xem có phần tử nào có thuộc tính button-status không
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    // Lặp qua các phần tử có thuộc tính button-status
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            // lấy ra thuộc tính đã định nghĩa bên pug
            const status = button.getAttribute("button-status");


            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }

            console.log(url.href);
            window.location.href = url.href;
        })
    });
}

// END BUTTON 


// form Search
const formSearch = document.querySelector("#form-search");
// console.log(formSearch); check dk trước để tránh ko bị chết code

if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = e.target.elements.keyword.value

        // console.log(e.target.elements.keyword.value);


        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    })
}
// END  SEARCH


// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
// console.log(buttonsPagination);

if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            // console.log(page);

            url.searchParams.set("page", page);


            window.location.href = url.href;
        })
    })
}

// END Pagination
//BUỔi 20


// CheckBox Multi 
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    // console.log(inputCheckAll);
    // console.log(inputsId);

    inputCheckAll.addEventListener("click", () => {
        console.log(inputCheckAll.checked); // return true or false
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        }
        else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;// tìm ra những ô input :checked đã check
            // console.log(countChecked); 
            // console.log(inputsId.length);

            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }
        })
    })
}
// END CheckBox Multi 


// Form change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");// tìm ra những ô input :checked đã check

        const typeChange = e.target.elements.type.value;

        console.log(typeChange);

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");
            if (!isConfirm) // nếu người dùng nhấn hủy
            {
                return;
            }
        }

        // console.log(typeChange);

        if (inputsChecked.length > 0) {
            let ids = [];

            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    // console.log(`${id}-${position}`);
                    ids.push(`${id}-${position}`);
                }
                else {
                    ids.push(id);
                }
            });
            // // console.log(ids.join(", "));
            // inputids.value = ids.join(", ");
            const stringIds = ids.join(", ");
            const inputids = formChangeMulti.querySelector("input[name='ids']");
            console.log(inputids);
            inputids.value = stringIds;
          
            formChangeMulti.submit();
        }
        else {
            alert("vùi lòng chọn ít nhất 1 sản phẩm!");
        }
    });
}
// END Form change Multi


// Show Alert 
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    // console.log(showAlert);
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// END Show Alert 

// Upload Image 
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {

    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");


    uploadImageInput.addEventListener("change", (e) => {
        // trong event luôn luôn trả 1 object và trong object có key là targer, là ô input đang bắt sự kiện
        console.log(e);

        // Preview image
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });


    // làm thêm nút xóa ảnh 
    const deleteImage = document.querySelector("[delete-image]");
    deleteImage.addEventListener("click", (e) => {
        uploadImagePreview.src = "";
    })
    // end nút xóa ảnh   
}

//END Upload Image 

// Sort
const sort = document.querySelector("[sort]");
// console.log(sort);

if (sort) {
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", (e) => {
        console.log(e.target.value);
        const value = e.target.value;

        const [sortKey, sortValue] = value.split("-");

        console.log(sortKey);
        console.log(sortValue);

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    })

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    });


    // Thêm giá trị chọn mặt định cho ô selected
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        console.log(sortKey);
        console.log(sortValue);

        const stringSort = `${sortKey}-${sortValue}`;
        console.log(stringSort);

        const optionSelect = sortSelect.querySelector(`option[value='${stringSort}']`);

        optionSelect.selected = true;
    }
}
// END Sort



