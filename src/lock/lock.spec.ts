import { Lock } from "./lock";
import { LockArguments } from "./lock-decorator";

describe("Lock", () => {
    it("should do nothing for primitive types", () => {
        const one = "abc";
        const two = "def";

        Lock(one);
        Lock(two);

        expect(true).toBe(true);
    });

    it("should prevent mutation of arrays", () => {
        const tc = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, [9, 10]],
            [[[11, 12], 13], 14, 15],
        ].map((item) => Lock(item));

        tc.forEach((testCase) => {
            testCase.forEach((item, index) => {
                try {
                    testCase[index] = -1;
                    fail(
                        "Error should have been thrown when trying to mutate: " +
                            testCase[index]
                    );
                } catch (err) {
                    expect(testCase[index]).not.toBe(-1);
                }
            });
        });
    });

    it("should prevent mutation of objects", () => {
        //normally we'd lock the whole structure
        //this is just for testing purposes
        const tc = [
            Lock({
                a: 56,
                b: {
                    c: 12,
                    d: 13,
                },
            }),
            Lock({
                a: 56,
                b: {
                    c: 12,
                    d: 13,
                },
            }),
        ];

        tc.forEach((testCase) => {
            try {
                testCase.a = -1;
                fail(
                    "Error should have been thrown when trying to mutate: " +
                        testCase.a
                );
            } catch (err) {
                expect(testCase.a).not.toBe(-1);
            }

            //make sure nested property also cannot be mutated
            try {
                testCase.b.c = -1;
                fail(
                    "Error should have been thrown when trying to mutate: " +
                        testCase.b.c
                );
            } catch (err) {
                expect(testCase.b.c).not.toBe(-1);
            }
        });
    });

    it("should prevent mutation of class property", () => {
        class TestClass {
            constructor(public value: number) {}
        }

        const testInstance = Lock(new TestClass(12));

        try {
            testInstance.value = -1;
            fail(
                "Error should have been thrown when trying to mutate: " +
                    testInstance.value
            );
        } catch (err) {
            expect(testInstance.value).not.toBe(-1);
        }
    });

    it("should lock with decorator", () => {

        class TestClass {
            constructor() {

            }

            @LockArguments
            callMe(object: any): void {
                try {
                    object.value = -1;
                    fail(
                        "Error should have been thrown when trying to mutate: " +
                        object.value
                    );
                } catch (err) {
                    expect(object.value).not.toBe(-1);
                }
            }
        }

        new TestClass().callMe({
            value: 1324
        });

    });
});
