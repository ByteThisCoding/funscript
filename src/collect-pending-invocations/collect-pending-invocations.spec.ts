import {
    CollectPendingInvocations,
} from "./collect-pending-invocations";
import { CollectPendingMethodInvocations } from "./collect-pending-invocations-decorator";

describe("CollectPendingInvocations", () => {
    function wait(ms: number): Promise<void> {
        return new Promise((r) => {
            setTimeout(r, ms);
        });
    }

    it("should allow method calls without interception", async () => {
        await CollectPendingInvocations(() => wait(10))().catch(fail);

        const result = await CollectPendingInvocations(async () => {
            await wait(12);
            return 17;
        })().catch(fail);
        expect(result).toBe(17);

        try {
            await CollectPendingInvocations(async () => {
                await wait(12);
                throw new Error(
                    "Error purposefully thrown in intercept pending async."
                );
            })();
            fail("Error should have been thrown");
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });

    it("should intercept method call with no parameters", async () => {
        let numCalls = 0;
        const testMethod = CollectPendingInvocations(async () => {
            numCalls++;
            await wait(100);
        });

        let promises = [testMethod(), testMethod(), testMethod()];

        await Promise.all(promises);

        expect(numCalls).toBe(1);
    });

    it("should intercept method call with parameters", async () => {
        let numCalls = 0;
        const testMethod = CollectPendingInvocations(async (num: number) => {
            numCalls++;
            await wait(100);
            return num + 1;
        });

        let promises = [testMethod(1), testMethod(1), testMethod(2)];

        const returnValues = await Promise.all(promises);

        expect(numCalls).toBe(2);
        expect(returnValues).toEqual([2, 2, 3]);
    });

    it("should intercept as method decorator", async () => {
        class TestClass {
            numCalls = 0;

            @CollectPendingMethodInvocations
            async add(num: number): Promise<number> {
                this.numCalls++;
                await wait(100);
                return num + 1;
            }
        }

        const tc = new TestClass();

        let promises = [tc.add(1), tc.add(1), tc.add(2)];

        const returnValues = await Promise.all(promises);

        expect(tc.numCalls).toBe(2);
        expect(returnValues).toEqual([2, 2, 3]);
    });

    it("should keep 'this' reference in place", async () => {
        class TestClass {
            numCalls = 0;

            @CollectPendingMethodInvocations
            async add(num: number): Promise<number> {
                this.numCalls++;
                await wait(100);
                return this.map(num);
            }

            map(num: number) {
                return num + 1;
            }
        }

        const tc = new TestClass();

        let promises = [tc.add(1), tc.add(1), tc.add(2)];

        const returnValues = await Promise.all(promises);

        expect(tc.numCalls).toBe(2);
        expect(returnValues).toEqual([2, 2, 3]);
    }, 100);
});
