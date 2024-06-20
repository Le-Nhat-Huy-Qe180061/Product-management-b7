

module.exports = (query) => {
// ta truyền vào biến và xóa đi req.query.status vì bên controller t truyền biến vào đã cso sản req.query
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    if (query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    }
    else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }


    return filterStatus;
}

