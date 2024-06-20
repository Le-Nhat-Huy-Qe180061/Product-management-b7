

module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: ""
    }

    if(query.keyword)
    {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp( objectSearch.keyword, "i"); //i đại diện cho ko phân biệt hoa vs thường

        objectSearch.regex = regex;
    }
   

    return objectSearch;
}