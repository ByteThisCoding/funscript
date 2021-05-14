import { Compose, ComposeAsync } from "./compose";

describe("Compose", () => {

    it("should compose two numeric functions with one argument", () => {
        const startNum = 12;

        const fOne = (num: number) => num + 3;
        const fTwo = (num: number) => num * 7;

        const expected = fTwo(fOne(startNum));

        const composite = Compose(fOne, fTwo);
        const actual = composite(startNum);

        expect(actual).toBe(expected);

    });

    it("should compose two numeric functions where first one has two arguments", () => {
        const startNum = 12;
        const startModifier = 4;

        const fOne = (num: number, modifier: number) => num + 3*modifier;
        const fTwo = (num: number) => num * 7;

        const expected = fTwo(fOne(startNum, startModifier));

        const composite = Compose(fOne, fTwo);
        const actual = composite(startNum, startModifier);

        expect(actual).toBe(expected);
    });

    it("should compose many functions", () => {

        const startNum = 12;
        const startModifier = 4;

        const fOne = (num: number, modifier: number) => num + 3*modifier;
        const fTwo = (num: number) => num * 7;
        const fThree = (num: number) => num / 5;
        const fFour = (num: number) => num * num / 3;

        const expected = fFour(fThree(fTwo(fOne(startNum, startModifier))));

        const composite = Compose(fOne, fTwo, fThree, fFour);
        const actual = composite(startNum, startModifier);

        expect(actual).toBe(expected);

    });

    it("should compose many functions as async", async () => {

        const startNum = 12;
        const startModifier = 4;

        const fOne = (num: number, modifier: number) => Promise.resolve(num + 3*modifier);
        const fTwo = (num: number) => Promise.resolve(num * 7);
        const fThree = (num: number) => Promise.resolve(num / 5);
        const fFour = (num: number) => Promise.resolve(num * num / 3);

        const expected = await fFour(
            await fThree(
                await fTwo(
                    await fOne(startNum, startModifier)
                )
            )
        );

        const composite = ComposeAsync(fOne, fTwo, fThree, fFour);
        const actual = await composite(startNum, startModifier);

        expect(actual).toBe(expected);

    }, 100);

});