import { FunObj } from "./fun-obj";

describe("FunObj", () => {
    it("should run forEach on an object", () => {
        const input: any = {
            a: 0,
            b: 12,
            c: 234,
            d: 12,
        };

        let collection = 0;
        let keysHit: string[] = [];

        FunObj.kvForEach(input, (key: string, value: number) => {
            collection += value;
            keysHit.push(key);
        });

        const expectedKeys = Object.keys(input);
        const expectedCollection = Object.keys(input).reduce(
            (acc, key) => acc + input[key],
            0
        );

        expect(keysHit).toEqual(expectedKeys);
        expect(collection).toEqual(expectedCollection);
    });

    it("should filter the keys of an object", () => {
        const obj = {
            aFilter: 12,
            b: 32,
            cFilter: 123,
            dFilter: 12312,
            e: 12312312,
        };

        const expectedObject = {
            b: 32,
            e: 12312312,
        };

        const actualObject = FunObj.kvFilter(
            obj,
            (key, value) => key.indexOf("Filter") === -1
        );
        expect(actualObject).toEqual(expectedObject);
    });

    it("should map the values of an object", () => {

        const mapFunc = (numInput: number) => numInput * 2;
        const inputObj = {
            a: 12,
            b: 1,
            c: 23432,
            d: 112
        };

        const expectedObj = {
            a: mapFunc(12),
            b: mapFunc(1),
            c: mapFunc(23432),
            d: mapFunc(112)
        };

        const actualObj = FunObj.kvMap(inputObj, (key, value) => mapFunc(value));

        expect(actualObj).toEqual(expectedObj);

    });

    it("should reduce an object", () => {

        const inputObj = {
            a: 12,
            b: 13,
            c: 14,
            d: 15
        };

        const expectedOutput = "a12b13c14d15";

        const actualOutput = FunObj.kvReduce(inputObj, (acc, key, value) => {
            return acc + key + value;
        }, "");

        expect(actualOutput).toBe(expectedOutput);

    });
});
