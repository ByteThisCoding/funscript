import { Equals } from "./equals";

describe("Equals", () => {
    it("should return true for primitives and objects with same reference", () => {
        const testObj = {
            a: true,
            b: {
                c: 12,
                d: 15,
                e: {},
            },
        };
        const tc = [
            [true, true],
            [false, false],
            ["a", "a"],
            [12, 12],
            [null, null],
            [undefined, undefined],
            [testObj, testObj],
        ];

        tc.forEach((testCase) => {
            expect(Equals(testCase[0], testCase[1])).toBe(true);
        });
    });

    it("should compare primitive types", () => {
        const testCases = [
            {
                a: 1,
                b: 1,
                isEqual: true,
            },
            {
                a: 1,
                b: 2,
                isEqual: false,
            },
            {
                a: null,
                b: null,
                isEqual: true,
            },
            {
                a: null,
                b: 1,
                isEqual: false,
            },
            {
                a: undefined,
                b: undefined,
                isEqual: true,
            },
            {
                a: "string",
                b: "string",
                isEqual: true,
            },
            {
                a: "abc",
                b: "def",
                isEqual: false,
            },
        ];

        testCases.forEach((tc) => {
            const result = Equals(tc.a, tc.b);
            expect(result).toBe(tc.isEqual);
        });
    });

    it("should return false for arrays of different sizes", () => {
        const tc = [
            [
                [1, 2, 3],
                [1, 2, 3, 4],
            ],
            [[1, 3], [1]],
            [
                [1, 3, 4, 5, 6, 7],
                [1, 2, 4],
            ],
        ];

        tc.forEach((testCase) => {
            expect(Equals(testCase[0], testCase[1])).toBe(false);
        });
    });

    it("should return true for equal arrays", () => {
        const tc = [
            [
                [1, 2, 3],
                [1, 2, 3],
            ],
            [[1], [1]],
            [[], []],
            [
                [1, [2, 3]],
                [1, [2, 3]],
            ],
        ];

        tc.forEach((testCase) => {
            expect(Equals(testCase[0], testCase[1])).toBe(true);
        });
    });

    it("should mark dates with the same time as equal", () => {
        const now = new Date();

        const tc = [
            [new Date(12345), new Date(12345)],
            [new Date(+now), new Date(+now)],
            [new Date(+now - 1000), new Date(+now - 1000)],
        ];

        tc.forEach((testCase) => {
            expect(Equals(testCase[0], testCase[1])).toBe(true);
        });
    });

    it("should mark dates with different times / non dates as not equal", () => {
        const now = new Date();

        const tc = [
            [new Date(12345), new Date(12)],
            [new Date(+now), new Date(+now - 1)],
            [new Date(+now - 1000), new Date(+now)],
            [new Date(), null],
            [null, new Date()],
        ];

        tc.forEach((testCase) => {
            expect(Equals(testCase[0], testCase[1])).toBe(false);
        });
    });

    it("should compare recursive structures", () => {
        const testCases = [
            {
                a: [1, 2, 3, 4],
                b: [1, 2, 3, 4],
                isEqual: true,
            },
            {
                a: [1, 2, 3, 4],
                b: [2, 3, 4, 1],
                isEqual: false,
            },
            {
                a: [1, [2, 3]],
                b: [1, [2, 3]],
                isEqual: true,
            },
            {
                a: [1, 2, 3],
                b: [1, [2, 3]],
                isEqual: false,
            },
            {
                a: {
                    a: true,
                    b: false,
                },
                b: {
                    a: true,
                    b: false,
                },
                isEqual: true,
            },
            {
                a: {
                    a: 12,
                    b: 12,
                },
                b: {
                    a: 13,
                    b: 14,
                },
                isEqual: false,
            },
        ];

        testCases.forEach((tc) => {
            const result = Equals(tc.a, tc.b);
            expect(result).toBe(tc.isEqual);
        });
    });

    it("should process equal arrays with objects", () => {

        const tc = [
            [[{a: true}], [{a: true}]]
        ];

        tc.forEach((testCase) => {
            expect(Equals(testCase[0], testCase[1])).toBe(true);
        });

    });
});
