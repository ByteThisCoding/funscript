import { iEquals } from "../models/equals";

export const Equals: iEquals = (a: any, b: any): boolean => {
    if (a === b) {
        return true;
    }

    if (typeof a !== typeof b) {
        return false;
    }

    //special case: Date
    if (a instanceof Date && b instanceof Date) {
        return +a === +b;
    } else if (a instanceof Date || b instanceof Date) {
        return false;
    }

    //other cases
    const getKeys = (input: any) => {
        try {
            return Object.keys(input);
        } catch (err) {
            return [];
        }
    };

    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) {
            return false;
        }

        return a.reduce((bool: boolean, item: any, index: number) => {
            return bool && Equals(item, b[index]);
        }, true);
    } else {
        const aKeys = getKeys(a);
        const bKeys = getKeys(b);

        if (aKeys.length !== bKeys.length) {
            return false;
        }

        if (aKeys.length > 1) {
            return aKeys.reduce((bool: boolean, key: string) => {
                return (
                    bool && bKeys.indexOf(key) > -1 && Equals(a[key], b[key])
                );
            }, true);
        } else {
            return false;
        }
    }
};
