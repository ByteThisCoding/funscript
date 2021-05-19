import { FunAr } from "../fun-ar/fun-ar";
import { iFunObj } from "../models/fun-obj";

export const FunObj: iFunObj = {
    /**
     * Run some callback for each key + value pair
     * @param input
     * @param callback
     * @param thisArg
     * @returns
     */
    kvForEach: <ValueType>(
        input: { [key: string]: ValueType },
        callback: (
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => void,
        thisArg?: any
    ): void => {
        return Object.keys(input).forEach((key, index) => {
            if (typeof thisArg !== "undefined") {
                callback.bind(thisArg)(key, input[key], index, input);
            } else {
                callback(key, input[key], index, input);
            }
        });
    },
    /**
     * Filter the keys from an object based on some callback
     * @param input
     * @param callback
     * @param thisArg
     * @returns
     */
    kvFilter: <ValueType>(
        input: { [key: string]: ValueType },
        callback: (
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => boolean,
        thisArg?: any
    ): { [key: string]: ValueType } => {
        return Object.keys(input)
            .filter((key, index) => {
                if (typeof thisArg !== "undefined") {
                    return callback.bind(thisArg)(
                        key,
                        input[key],
                        index,
                        input
                    );
                } else {
                    return callback(key, input[key], index, input);
                }
            })
            .reduce((obj, key) => {
                obj[key] = input[key];
                return obj;
            }, {} as { [key: string]: ValueType });
    },
    /**
     * Map the values of an object to a new object with the same keys
     * @param input
     * @param callback
     * @param thisArg
     * @returns
     */
    kvMap: <ValueType, MappedValueType>(
        input: { [key: string]: ValueType },
        callback: (
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => MappedValueType,
        thisArg?: any
    ): { [key: string]: MappedValueType } => {
        return Object.keys(input).reduce((obj, key, index) => {
            if (typeof thisArg !== "undefined") {
                obj[key] = callback.bind(thisArg)(
                    key,
                    input[key],
                    index,
                    input
                );
            } else {
                obj[key] = callback(key, input[key], index, input);
            }
            return obj;
        }, {} as { [key: string]: MappedValueType });
    },
    /**
     * Reduce an object to something else
     * @param input
     * @param callback
     * @param initialValue
     * @returns
     */
    kvReduce: <ValueType, OutputType>(
        input: { [key: string]: ValueType },
        callback: (
            acc: OutputType,
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => OutputType,
        initialValue?: OutputType
    ): OutputType => {
        const reduceCallback = (acc: any, key: string, index: number): any => {
            return callback(acc, key, input[key], index, input);
        };
        if (typeof initialValue !== "undefined") {
            return Object.keys(input).reduce(reduceCallback, initialValue);
        } else {
            return Object.keys(input).reduce(reduceCallback) as any;
        }
    },
    /**
     * Get the list of keys which two objects share in common
     * @param a
     * @param b
     * @returns
     */
    keysIntersection: (
        a: { [key: string]: any } | string[],
        b: { [key: string]: any } | string[]
    ): string[] => {
        return FunAr.intersection(
            Array.isArray(a) ? a : Object.keys(a),
            Array.isArray(b) ? b : Object.keys(b)
        );
    },
    /**
     * Check if two objects have any keys in common
     * @param a
     * @param b
     */
    keysIntersect: (
        a: { [key: string]: any } | string[],
        b: { [key: string]: any } | string[]
    ): boolean => {
        return FunAr.intersects(
            Array.isArray(a) ? a : Object.keys(a),
            Array.isArray(b) ? b : Object.keys(b)
        );
    },
};
