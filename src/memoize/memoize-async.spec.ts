import { Memoize } from "./memoize";
import { MemoizeAsync } from "./memoize-async";
import { MemoizeAsyncMethod } from "./memoize-async-decorator";

describe("MemoizeAsync", () => {
    it("should memoize in basic scenario", async () => {
        let hitCount = 0;
        const input = 12;
        const map = (input: number) => Promise.resolve(input * 2);
        const calc = (input: number) => {
            hitCount++;
            return map(input);
        };

        let expected = await map(input);
        let actual;

        const memoized = MemoizeAsync(calc);
        actual = await memoized(input);
        actual = await memoized(input);
        actual = await memoized(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    }, 100);

    it("should memoize multiple inputs seperately", async () => {
        let hitCount = 0;
        const inputs = [12, 13, 15];
        const map = (input: number) => Promise.resolve(input * 2);
        const calc = (input: number) => {
            hitCount++;
            return map(input);
        };

        let expected = await Promise.all(inputs.map(map));
        let actual: any = [null, null, null];

        const memoized = MemoizeAsync(calc);
        actual[0] = await memoized(inputs[0]);
        actual[0] = await memoized(inputs[0]);
        actual[0] = await memoized(inputs[0]);

        actual[1] = await memoized(inputs[1]);
        actual[1] = await memoized(inputs[1]);
        actual[1] = await memoized(inputs[1]);

        actual[2] = await memoized(inputs[2]);
        actual[2] = await memoized(inputs[2]);
        actual[2] = await memoized(inputs[2]);

        expect(hitCount).toBe(3);
        expect(actual).toEqual(expected);
    }, 100);

    it("should expire in cache based on specifications", async () => {
        let hitCount = 0;

        const expiration = 100;

        const input = 12;
        const map = (input: number) => Promise.resolve(input * 2);
        const calc = (input: number) => {
            hitCount++;
            return map(input);
        };

        let expected = await map(input);
        let actual;

        const memoized = MemoizeAsync(calc, {
            cacheExpiration: {
                evaluate: () => expiration,
                type: "relative",
            },
        });
        actual = await memoized(input);
        actual = await memoized(input);
        actual = await memoized(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);

        await new Promise((r) => setTimeout(r, expiration * 2));

        actual = await memoized(input);

        expect(hitCount).toBe(2);
        expect(actual).toBe(expected);
    }, 1000);

    it("should memoize class method with decorator", async () => {
        let hitCount = 0;
        const input = 123;

        const map = (input: number) => Promise.resolve(input * 2);
        class MemoizeTest {
            @MemoizeAsyncMethod()
            calc(input: number) {
                hitCount++;
                return map(input);
            }
        }

        const tester = new MemoizeTest();

        let expected = await map(input);
        let actual;

        actual = await tester.calc(input);
        actual = await tester.calc(input);
        actual = await tester.calc(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    }, 200);

    it("should memoize and keep 'this' reference in place", async () => {
        let hitCount = 0;

        const map = (input: number) => Promise.resolve(input * 2);
        const input = 123;
        class TestClass {
            calc(input: number) {
                hitCount++;
                return this.map(input);
            }

            private map(input: number) {
                return map(input);
            }
        }

        const tester = new TestClass();
        const memoizedCalc = MemoizeAsync(tester.calc.bind(tester));

        let expected = await map(input);
        let actual;

        actual = await memoizedCalc(input);
        actual = await memoizedCalc(input);
        actual = await memoizedCalc(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    }, 200);

    it("should memoize and keep 'this' reference in place for decorator", async () => {
        let hitCount = 0;

        const map = (input: number) => Promise.resolve(input * 2);
        const input = 123;
        class TestClass {
            @MemoizeAsyncMethod()
            calc(input: number) {
                hitCount++;
                return this.map(input);
            }

            private map(input: number) {
                return map(input);
            }
        }

        const tester = new TestClass();

        let expected = await map(input);
        let actual;

        actual = await tester.calc(input);
        actual = await tester.calc(input);
        actual = await tester.calc(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    }, 200);

    it("should memoize and keep 'this' reference in place for decorator with options specified", async () => {
        let hitCount = 0;

        const offset = 123;
        const map = (input: number): Promise<number> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(input * 2), 55)
            })
        };
        const input = 123;
        class TestClass {

            constructor(
                private offset: number
            ) {}
            @MemoizeAsyncMethod({
                cacheExpiration: {
                    evaluate: () => 1000 * 60,
                    type: "relative",
                },
            })
            calc(input: number): Promise<number> {
                hitCount++;
                return this.thisMap(input);
            }

            private async thisMap(input: number): Promise<number> {
                const partialResult = await map(input);
                return partialResult + this.offset;
            }
        }

        const tester = new TestClass(offset);

        let expected = (await map(input)) + offset;
        let actual;

        actual = (await tester.calc(input));
        actual = (await tester.calc(input));
        actual = (await tester.calc(input));

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    }, 200);
});
