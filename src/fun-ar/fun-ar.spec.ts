import { FunAr } from "./fun-ar";

describe("FunAr", () => {

    it("should forEach in sequence", async () => {
        let counter = 0;
        const input = [1, 2, 3, 4, 5];
        const expectedOutput = input.reduce((acc, item) => acc + item);

        await FunAr.async.seq.forEach(input, (item) => counter += item);
        expect(counter).toBe(expectedOutput);
    }, 100);

    it("should forEach in parallel", async () => {

        let counter = 0;
        const input = [1, 2, 3, 4, 5];
        const expectedOutput = input.reduce((acc, item) => acc + item);

        await FunAr.async.parallel.forEach(input, (item) => counter += item);
        expect(counter).toBe(expectedOutput);
    }, 100);

    it("should find in sequence", async () => {
        const searchItem = 123;
        const input = [1, 2, 3, 4, searchItem, 6];

        const itemFound = await FunAr.async.seq.find(input, (item) => item === searchItem);
        expect(itemFound).toBe(searchItem);
    }, 100);

    it("should map in sequence", async () => {
        const input = [1, 2, 3, 4, 5];
        const map = (item: number) => item*item;

        const expected = input.map(map);

        const actual = await FunAr.async.seq.map(input, map);
        expect(actual).toEqual(expected);
    }, 100);

    it("should map in parallel", async () => {
        const input = [1, 2, 3, 4, 5];
        const map = (item: number) => item*item;

        const expected = input.map(map);

        const actual = await FunAr.async.parallel.map(input, map);
        expect(actual).toEqual(expected);
    }, 100);

    it("should filter in sequence", async () => {

        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const filter = (item: number) => item % 2 === 0;

        const expected = input.filter(filter);

        const actual = await FunAr.async.seq.filter(input, filter);
        expect(actual).toEqual(expected);

    }, 100);

    it("should filter in parallel", async () => {

        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const filter = (item: number) => item % 2 === 0;

        const expected = input.filter(filter);

        const actual = await FunAr.async.parallel.filter(input, filter);
        expect(actual).toEqual(expected);

    }, 100);

    it("should reduce in sequence", async () => {

        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const reduce = (acc: number, item: number) => acc + item;

        const expected = input.reduce(reduce);

        const actual = await FunAr.async.seq.reduce(input, reduce);
        expect(actual).toEqual(expected);

    }, 100);

});