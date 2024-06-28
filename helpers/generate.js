
module.exports.generateRandomString = (length) => {

    const charaters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxwyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += charaters.charAt(Math.floor(Math.random() * charaters.length));
    }

    return result;
}

module.exports.generateRandomNumber = (length) => {

    const charaters = "0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += charaters.charAt(Math.floor(Math.random() * charaters.length));
    }

    return result;
}