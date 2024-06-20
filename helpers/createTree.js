
//-- B29

let count = 0; // fix vị trí nếu ko vị trí sẽ ăn theo thg cha
const createTree = (arr, parentId = "") => {
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


module.exports.tree = (arr, parentId = "") => {
    // do biến count là biến toàn cục đc lưu trong server và khi ấy mỗi vọng lặp tăng dần lên mà server thì ko load lại 
    count = 0; // để đảm bảo mỗi lần load lại trâng bến count đc reset lại ko để ko bị ảnh hưởng đển danh sách sản phẩm
    const tree = createTree(arr, parentId = "");
    return tree;
}