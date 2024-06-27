
//-- B29

function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parentId) {
            const children = createTree(arr, item.id);
            if (children.length > 0) {
                item.children = children;
            }
            tree.push(item);
        }
    });
    return tree;
}

module.exports = (records) => {
    const tree = createTree(records);
    return tree;
}


let count = 0; // fix vị trí nếu ko vị trí sẽ ăn theo thg cha
const createTree2 = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parentId) {
            count++;
            const newItem = item;
            newItem.index = count
            const children = createTree(arr, item.id);
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}


module.exports.tree2 = (arr, parentId = "") => {
    // do biến count là biến toàn cục đc lưu trong server và khi ấy mỗi vọng lặp tăng dần lên mà server thì ko load lại 
    count = 0; // để đảm bảo mỗi lần load lại trâng bến count đc reset lại ko để ko bị ảnh hưởng đển danh sách sản phẩm
    const tree = createTree2(arr, parentId = "");
    return tree;
}