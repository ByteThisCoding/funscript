import { PRIMITIVE_TYPES } from "../domain/primitive-types";
import { iClone } from "../models/clone";

export const Clone: iClone = <T>(obj: T): T => {
    if (PRIMITIVE_TYPES.indexOf(typeof obj) > -1 || obj === null) {
        return obj;
    }

    //@ts-ignore
    if (typeof obj.clone === "function") {
        //@ts-ignore
        return obj.clone(); //use it's native clone method if it has one
    }

    if (typeof obj === "function") {
        //@ts-ignore
        return obj.bind();
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => Clone(item)) as unknown as T;
    }

    return Object.keys(obj).reduce((newObj, key) => {
        //@ts-ignore
        newObj[key] = Clone(obj[key]);
        return newObj;
    }, {} as T);
};
