import { Memoize } from "./memoize";
import { MemoizeMethod } from "./memoize-decorator";

describe("Memoize", () => {
    it("should memoize in basic scenario", () => {
        let hitCount = 0;
        const input = 12;
        const map = (input: number) => input * 2;
        const calc = (input: number) => {
            hitCount++;
            return map(input);
        };

        let expected = map(input);
        let actual;

        const memoized = Memoize(calc);
        actual = memoized(input);
        actual = memoized(input);
        actual = memoized(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    });

    it("should memoize multiple inputs seperately", () => {
        let hitCount = 0;
        const inputs = [12, 13, 15];
        const map = (input: number) => input * 2;
        const calc = (input: number) => {
            hitCount++;
            return map(input);
        };

        let expected = inputs.map(map);
        let actual: any = [null, null, null];

        const memoized = Memoize(calc);
        actual[0] = memoized(inputs[0]);
        actual[0] = memoized(inputs[0]);
        actual[0] = memoized(inputs[0]);

        actual[1] = memoized(inputs[1]);
        actual[1] = memoized(inputs[1]);
        actual[1] = memoized(inputs[1]);

        actual[2] = memoized(inputs[2]);
        actual[2] = memoized(inputs[2]);
        actual[2] = memoized(inputs[2]);

        expect(hitCount).toBe(3);
        expect(actual).toEqual(expected);
    });

    it("should expire in cache based on specifications", async () => {
        let hitCount = 0;

        const expiration = 100;

        const input = 12;
        const map = (input: number) => input * 2;
        const calc = (input: number) => {
            hitCount++;
            return map(input);
        };

        let expected = map(input);
        let actual;

        const memoized = Memoize(calc, {
            cacheExpiration: {
                evaluate: () => expiration,
                type: "relative",
            },
        });
        actual = memoized(input);
        actual = memoized(input);
        actual = memoized(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);

        await new Promise((r) => setTimeout(r, expiration * 2));

        actual = memoized(input);

        expect(hitCount).toBe(2);
        expect(actual).toBe(expected);
    }, 1000);

    it("should memoize class method with decorator", () => {
        let hitCount = 0;
        const input = 123;

        const map = (input: number) => input * 2;
        class MemoizeTest {
            @MemoizeMethod()
            calc(input: number) {
                hitCount++;
                return map(input);
            }
        }

        const tester = new MemoizeTest();

        let expected = map(input);
        let actual;

        actual = tester.calc(input);
        actual = tester.calc(input);
        actual = tester.calc(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);
    });

    it("should memoize and keep 'this' reference in place", () => {
        let hitCount = 0;

        const map = (input: number) => input * 2;
        const input = 123;
        class TestClass {

            @MemoizeMethod()
            calc(input: number) {
                hitCount ++;
                return this.map(input);
            }

            private map(input: number) {
                return map(input);
            }

        }

        const tester = new TestClass();

        let expected = map(input);
        let actual;

        actual = tester.calc(input);
        actual = tester.calc(input);
        actual = tester.calc(input);

        expect(hitCount).toBe(1);
        expect(actual).toBe(expected);

    });

});
