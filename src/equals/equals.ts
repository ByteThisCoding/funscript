import { iEquals } from "../models/equals";

export const Equals: iEquals = (a: any, b: any): boolean => {
    // If a and b reference the same value, return true
    if (a === b) {
        return true;
    }

    // If a and b aren't the same type, return false
    if (typeof a != typeof b) {
        return false;
    }

    // Already know types are the same, so if type is number
    // and both NaN, return true
    if (typeof a == "number" && isNaN(a) && isNaN(b)) {
        return true;
    }

    // Get internal [[Class]]
    const aClass = Object.prototype.toString.call(a);
    const bClass = Object.prototype.toString.call(b);

    // Return false if not same class
    if (aClass != bClass) {
        return false;
    }

    // If they're Boolean, String or Number objects, check values
    if (
        aClass == "[object Boolean]" ||
        aClass == "[object String]" ||
        aClass == "[object Number]"
    ) {
        return a.valueOf() == b.valueOf();
    }

    if (aClass === "[object Date]") {
        return +a == +b;
    }

    // If they're RegExps, Dates or Error objects, check stringified values
    if (
        aClass === "[object RegExp]" ||
        aClass === "[object Date]" ||
        aClass === "[object Error]"
    ) {
        return a.toString() === b.toString();
    }

    // if it's a set or map, put to array or object
    if (aClass === '[object Set]') {
        a = [...a];
        b = [...b];
    } else if (aClass === '[object Map]') {
        a = Object.fromEntries(a);
        b = Object.fromEntries(b);
    }

    // Otherwise they're Objects, Functions or Arrays or some kind of host object
    if (typeof a === "object" || typeof a === "function") {
        // For functions, check stringigied values are the same
        // Almost certainly false if a and b aren't trivial
        // and are different functions
        if (aClass === "[object Function]" && a.toString() !== b.toString()) {
            return false;
        }

        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);

        // If they don't have the same number of keys, return false
        if (aKeys.length !== bKeys.length) {
            return false;
        }

        // Check they have the same keys
        if (
            !aKeys.every(function (key) {
                return b.hasOwnProperty(key);
            })
        )
            return false;

        // Check key values - uses ES5 Object.keys
        return aKeys.every(function (key) {
            return Equals(a[key], b[key]);
        });
    }
    return false;
};
