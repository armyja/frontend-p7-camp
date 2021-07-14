// 10 进制浮点数 转换成 长浮点数并用 16 进制表示
function dec2hexDouble(num) {
    let sign = 0
    let offset = 1023;
    if (num < 0) {
        sign = 1;
        num = -num;
    }
    let integer = Math.floor(num);
    let decimal = num - integer;

    let binStr = dec2binInt(integer);
    if (binStr.length > 0) {
        offset += binStr.length - 1;
    }

    let i = decimal;
    while (i !== 0 && !isFull(binStr)) {
        i = i * 2;
        binStr += Math.floor(i);
        i -= Math.floor(i);
    }
    if (integer === 0) {
        offset -= (1 + binStr.indexOf("1"))
    }

    if (offset < 0 || offset > 2047) {
        throw new RangeError("指数精度超出范围：-1023 ~ 1024，当前值：" + offset - 1023);
    }

    binStr = binStr.substring(binStr.indexOf("1") + 1)
    let binResult = (sign + dec2binInt(offset).padStart(11, "0") + binStr).padEnd(64, "0");
    return binTo64(binResult);
}

function binTo64(str) {
    const SIGNS =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+".split("");
    let result = "";
    while (str && str.length) {
        let s = str.substring(str.length - 6, str.length).padEnd(6, "0");
        str = str.substring(0, str.length - 6);
        let p = 0;
        for (let i = 0; i < 6; i++) {
            p += (s[i] - "0") * (2 ** (5 - i));
        }
        result = SIGNS[p] + result;
    }
    return result;
}

// function bin2hex(str) {
//     let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
//     let result = "";
//     while (str && str.length) {
//         let s = str.substring(str.length - 4, str.length).padEnd(4, "0");
//         str = str.substring(0, str.length - 4);
//         let p = 0;
//         for (let i = 0; i < 4; i++) {
//             p += (s[i] - "0") * (2 ** (3 - i));
//         }
//         result = arr[p] + result;
//     }
//     return result;
// }

function dec2binInt(num) {
    let binStr = ""
    let i = num;
    while (i != 0) {
        binStr = i % 2 + binStr;
        i >>= 1;
    }
    return binStr;
}

function isFull(binStr) {
    let index = binStr.indexOf("1");
    if (index === -1) {
        return false;
    }
    if (binStr.length - index - 1 >= 52) {
        return true;
    }
    return false;
}
console.log(dec2hexDouble(12))

module.exports = {
    dec2hexDouble
}