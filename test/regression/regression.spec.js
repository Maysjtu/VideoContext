import puppeteer from "puppeteer";
import path from "path";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { testTimeout, puppeteerParams, screenshotParams, imageSnapshotParams } from "./config.js";

expect.extend({ toMatchImageSnapshot });

let browser = null;
let page = null;

/**
 * @param {Object} configuration - test configuration parameters.
 * @param {String} configuration.file - the .html file to be tested.
 * @param {Number} configuration.seqLength - the length of the test sequence
 *        specified in the .html file (in seconds).
 */
const transitionTest = async ({ file, seqLength }) => {
    console.info(`Started test of: ${file}`);

    // eslint-disable-next-line
    await page.goto(`file:${path.join(__dirname, `test-pages/${file}`)}`, {
        waitUntil: "networkidle0",
        timeout: 60000
    });

    // Start playback sequence
    await page.click("#canvas");

    // Take a screenshot every second, for the duration of the sequence
    for (let i = 0; i < seqLength; i++) {
        await page.waitFor(Number(`#{i}000`));
        const image = await page.screenshot(screenshotParams);
        expect(image).toMatchImageSnapshot(imageSnapshotParams);
    }
};

/**
 * @param {Object} configuration - test configuration parameters.
 * @param {String} configuration.file - the .html file to be tested.
 */
const effectTest = async ({ file }) => {
    console.info(`Started test of: ${file}`);

    // eslint-disable-next-line
    await page.goto(`file:${path.join(__dirname, `test-pages/${file}`)}`, {
        waitUntil: "networkidle0",
        timeout: 60000
    });

    const beforeImage = await page.screenshot(screenshotParams);
    expect(beforeImage).toMatchImageSnapshot(imageSnapshotParams);

    // Apply effect to the video node
    await page.click("#canvas");

    const afterImage = await page.screenshot(screenshotParams);
    expect(afterImage).toMatchImageSnapshot(imageSnapshotParams);
};

beforeEach(async () => {
    browser = await puppeteer.launch(puppeteerParams);
    page = await browser.newPage();
});

afterEach(async () => {
    await page.close();
    await browser.close();
});

describe("Visual regressions: playback", () => {
    test(
        "Play/Pause",
        async () => {
            console.info("Started test of: playback.html");

            // eslint-disable-next-line
            await page.goto(`file:${path.join(__dirname, `test-pages/playback.html`)}`, {
                waitUntil: "networkidle0",
                timeout: 60000
            });

            // Start playback
            await page.click("#play");
            await page.waitFor(1000);

            const afterPlayImage = await page.screenshot(screenshotParams);
            expect(afterPlayImage).toMatchImageSnapshot(imageSnapshotParams);

            // Pause playback
            await page.waitFor(1000);
            await page.click("#pause");

            const afterPauseImage = await page.screenshot(screenshotParams);
            expect(afterPauseImage).toMatchImageSnapshot(imageSnapshotParams);
        },
        testTimeout
    );
});

describe("Visual regressions: transitions", () => {
    test(
        "Crossfade",
        async () => {
            await transitionTest({
                file: "transition-crossfade.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "Star Wipe",
        async () => {
            await transitionTest({
                file: "transition-starWipe.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "Vertical Wipe",
        async () => {
            await transitionTest({
                file: "transition-verticalWipe.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "Horizontal Wipe",
        async () => {
            await transitionTest({
                file: "transition-horizontalWipe.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "Dreamfade",
        async () => {
            await transitionTest({
                file: "transition-dreamFade.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "Random Dissolve",
        async () => {
            await transitionTest({
                file: "transition-randomDissolve.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "Static Dissolve",
        async () => {
            await transitionTest({
                file: "transition-staticDissolve.html",
                seqLength: 6
            });
        },
        testTimeout
    );

    test(
        "To Color and Back Fade",
        async () => {
            await transitionTest({
                file: "transition-toColorAndBackFade.html",
                seqLength: 6
            });
        },
        testTimeout
    );
});

describe("Visual regressions: effects", () => {
    test(
        "Monochrome",
        async () => {
            await effectTest({ file: "effect-monochrome.html" });
        },
        testTimeout
    );

    test(
        "Horizontal Blur",
        async () => {
            await effectTest({ file: "effect-horizontalBlur.html" });
        },
        testTimeout
    );

    test(
        "Vertical Blur",
        async () => {
            await effectTest({ file: "effect-verticalBlur.html" });
        },
        testTimeout
    );

    test(
        "Static",
        async () => {
            await effectTest({ file: "effect-static.html" });
        },
        testTimeout
    );

    test(
        "Opacity",
        async () => {
            await effectTest({ file: "effect-opacity.html" });
        },
        testTimeout
    );

    test(
        "Crop",
        async () => {
            await effectTest({ file: "effect-crop.html" });
        },
        testTimeout
    );

    test(
        "Colour Threshold",
        async () => {
            await effectTest({ file: "effect-colorThreshold.html" });
        },
        testTimeout
    );
});
