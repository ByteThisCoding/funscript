import { FunAr } from "./fun-ar";

describe("FunAr", () => {
    it("should forEach in sequence", async () => {
        let counter = 0;
        const input = new Array(100000)
            .fill(0)
            .map((_: number, index: number) => index);
        const expectedOutput = input.reduce((acc, item) => acc + item);

        await FunAr.async.seq.forEach(input, (item) => (counter += item));
        expect(counter).toBe(expectedOutput);
    }, 100);

    it("should forEach in parallel", async () => {
        let counter = 0;
        const input = [1, 2, 3, 4, 5];
        const expectedOutput = input.reduce((acc, item) => acc + item);

        await FunAr.async.parallel.forEach(input, (item) => (counter += item));
        expect(counter).toBe(expectedOutput);
    }, 100);

    it("should find in sequence", async () => {
        const searchItem = 123;
        const input = [1, 2, 3, 4, searchItem, 6];

        const itemFound = await FunAr.async.seq.find(
            input,
            (item) => item === searchItem
        );
        expect(itemFound).toBe(searchItem);
    }, 100);

    it("should map in sequence", async () => {
        const input = [1, 2, 3, 4, 5];
        const map = (item: number) => item * item;

        const expected = input.map(map);

        const actual = await FunAr.async.seq.map(input, map);
        expect(actual).toEqual(expected);
    }, 100);

    it("should map in parallel", async () => {
        const input = [1, 2, 3, 4, 5];
        const map = (item: number) => item * item;

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

    it("should propogate errors thrown", async () => {
        //simple
        const message = "Test throw!";
        const input = [1, 2, 3];
        const map = (item: number) => {
            if (item === 2) {
                throw new Error(message);
            }
            return item;
        };
        try {
            await FunAr.async.seq.map(input, map);
            fail("Error should have been thrown and propogated!");
        } catch (err) {
            expect(err.toString().indexOf(message)).toBeGreaterThan(-1);
        }

        //error thrown in async in async
        const newMessage = "Test in test throw!";
        const newInput = [4, 5, 6];
        const asyncMap = async (item: number) => {
            const result = await new Promise<number>((resolve, reject) => {
                if (item === 5) {
                    reject(newMessage);
                } else {
                    resolve(item);
                }
            });
            return result * 2;
        };

        try {
            await FunAr.async.seq.map(newInput, asyncMap);
            fail("Error should have been thrown and propogated!");
        } catch (err) {
            expect(err.toString().indexOf(newMessage)).toBeGreaterThan(-1);
        }
    });

    it("should get the subset of an array", () => {
        const tc = [
            {
                input: [1, 2, 3, 4, 5],
                startIndex: 1,
                endIndex: 3,
                expected: [2, 3],
            },
            {
                input: [1, 2, 3, 4, 5, 6, 7],
                startIndex: 2,
                endIndex: 5,
                expected: [3, 4, 5],
            },
        ];

        tc.forEach((tc) => {
            const actual = FunAr.subset(tc.input, tc.startIndex, tc.endIndex);
            expect(actual).toEqual(tc.expected);
        });
    });

    it("should check if an array is a subset of another array", () => {
        const tc = [
            {
                input: [1, 2, 3],
                of: [0, 1, 2, 3, 4],
                expected: true,
            },
            {
                input: [-1, 2, 3],
                of: [0, 1, 2, 3, 4],
                expected: false,
            },
            {
                input: [1, 2, 3],
                of: [2, 3],
                expected: false,
            },
            {
                input: [4, 5, 6, 7, 8],
                of: [4, 5, 6, 7, 8],
                expected: true,
            },
        ];

        tc.forEach((tc) => {
            const actual = FunAr.isSubsetOf(tc.input, tc.of);
            expect(actual).toEqual(tc.expected);
        });
    });

    it("should get the unique values of an array", () => {
        const tc = [
            {
                input: [1, 1, 1],
                expected: [1],
            },
            {
                input: [1, 2, 3, 4],
                expected: [1, 2, 3, 4],
            },
            {
                input: [1, 1, 2, 3, 3, 4, 4, 5, 4, 5],
                expected: [1, 2, 3, 4, 5],
            },
        ];

        tc.forEach((tc) => {
            const actual = FunAr.uniqueValues(tc.input);
            expect(actual).toEqual(tc.expected);
        });
    });

    it("should get the intersection of two arrays", () => {
        const tc = [
            {
                a: [1, 2, 3],
                b: [2, 3, 4],
                expected: [2, 3],
            },
            {
                a: [1, 2, 3],
                b: [4, 5, 6],
                expected: [],
            },
            {
                a: [1, 2, 3],
                b: [1, 2, 3],
                expected: [1, 2, 3],
            },
            {
                a: [1, 1, 2, 3, 3],
                b: [1, 2, 3],
                expected: [1, 2, 3],
            },
        ];

        tc.forEach((tc) => {
            const actual = FunAr.intersection(tc.a, tc.b);
            expect(actual).toEqual(tc.expected);
        });
    });
});
