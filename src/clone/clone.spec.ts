import { Clone } from "./clone";
import { CloneArguments } from "./clone-decorator";

describe("Clone", () => {
    it("should clone primitive values (base case)", () => {
        const testCases = [5, 6, 7, "str", "something", null, undefined];

        testCases.forEach((tc) => {
            expect(Clone(tc)).toBe(tc);
        });
    });

    it("should clone recursive structures", () => {
        const testCases = [
            [1, 2, 3, 4],
            {
                a: true,
                b: false,
                c: {
                    something: "some",
                    value: 15,
                },
            },
            [1, [2, 3, [4, 5, 6, 7]]],
        ];

        testCases.forEach((tc) => {
            const cloned = Clone(tc);
            expect(cloned === tc).toBe(false);
            expect(cloned).toEqual(tc);
        });

        const finalCase = {
            a: {
                b: true,
                c: false,
            },
        };
        const finalCloned = Clone(finalCase);
        expect(finalCase === finalCloned).toBe(false);
        expect(finalCase.a === finalCloned.a).toBe(false);
    });

    it("should clone with decorators", () => {
        class Test {
            constructor(private callback: Function) {}

            @CloneArguments
            call(param: any) {
                this.callback(param);
            }
        }

        const testObj = {
            a: [1, 2, 3, 4],
            b: "test",
            c: {
                d: "something",
                e: null,
                f: true,
                g: false,
            },
        };

        const callback = (clonedObj: any) => {
            expect(clonedObj === testObj).toBe(false);
            expect(clonedObj).toEqual(testObj);
        };

        new Test(callback).call(testObj);
    });

    it("should clone a function", () => {
        const func = () => 15;
        const cloned = Clone(func);
        expect(func === cloned).toBe(false);
        expect(func()).toBe(cloned());
    });

    it("should call object's native clone method if it has one", () => {
        class TestClone {
            constructor(public val: number) {}

            clone() {
                return new TestClone(this.val);
            }
        }

        const first = new TestClone(12);
        const second = Clone(first);

        expect(first === second).toBe(false);
        expect(first).toEqual(second);
    });
});
