var radix = 36//must be between 2 and 36, should be > 10 for 'encode' to act as a shortener

function encode(num) {
    return num.toString(radix)
}

function decode(str) {
    return parseInt(str, radix)
}

module.exports.encode = encode
module.exports.decode = decode
