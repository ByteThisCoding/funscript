import { Clone } from "../clone/clone";
import { PRIMITIVE_TYPES } from "../domain/primitive-types";
import { iLock } from "../models/lock";

/**
 * Clone an object, lock it, and return that locked obj
 * @param obj <T>
 * @returns <T>
 */

export const Lock: iLock = <T>(obj: T): T => {
    return DoLock(obj, true);
};

function DoLock<T>(obj: T, clone: boolean): T {
    if (PRIMITIVE_TYPES.indexOf(typeof obj) > -1 || obj === null) {
        return obj;
    }

    const cloned = clone ? Clone(obj) : obj;

    if (Array.isArray(cloned)) {
        cloned.forEach((item) => DoLock(item, false));
    } else {
        Object.keys(cloned).forEach((key) => {
            //@ts-ignore
            DoLock(cloned[key], false);
        });
    }
    Object.freeze(cloned);

    return cloned;
}
