import playwright from "playwright";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { inspect } from "util";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const dirname = process.cwd();

const wordpressPages = [
  "https://www.wordpress.com",
  "https://www.whitehouse.gov",
  "https://www.nytimes.com",
  "https://www.usatoday.com",
  "https://www.nypost.com",
  "https://www.nytimes.com/wirecutter/",
  "https://www.techcrunch.com",
  "https://www.capgemini.com/",
  "https://www.theverge.com",
];

(async () => {
  const browser = await playwright.chromium.launch();

  writeFileSync(
    join(dirname, "./results.md"),
    "| HOST | TIME (ms) | DIFF (# of pixels) |\n | --- | --- | --- |\n"
  );

  const allMutations = {};

  for (const wordpressPage of wordpressPages) {
    try {
      const page = await browser.newPage();
      await page.goto(wordpressPage, {
        waitUntil: "networkidle",
      });

      await page.addScriptTag({ path: join(dirname, "hydration-script.js") });

      page.on("console", (msg) => {
        if (msg.text().startsWith("mutation")) {
          const mutation = JSON.parse(msg.text().replace("mutation ", ""));
          console.log(inspect(mutation, { colors: true, depth: 5 }));

          if (!allMutations[wordpressPage]) {
            allMutations[wordpressPage] = [];
          }
          allMutations[wordpressPage].push(mutation);
        }
      });

      /**
       * Takes a screenshot of the page
       *
       * @param {Object} obj
       * @param {playwright.Page} obj.page Page object
       * @param {string} preOrPost Whether to take a screenshot before or after hydration
       * @returns a promise that resolves to a buffer of the screenshot
       */
      async function takeScreenshot({ page }, preOrPost) {
        const hostname = new URL(page.url()).hostname;
        // check if the screenshots directory exists
        const screenshotsDir = join(dirname, "./screenshots/", hostname);
        const screenshot = await page.screenshot({
          type: "png",
          fullPage: true,
          path: join(screenshotsDir, `${preOrPost}.png`),
        });

        return screenshot;
      }

      await page.exposeBinding("takeScreenshot", takeScreenshot);

      const { time } = await page.evaluate(async () => {
        /**
         * Takes a Mutation and returns the string representation of the node
         * @param {MutationRecord} mutation
         */
        function mutationToString(mutation) {
          var tmpNode = document.createElement("div");
          tmpNode.appendChild(mutation.target.cloneNode(true));
          var str = tmpNode.innerHTML.slice(0, 70);
          tmpNode = mutation = null; // prevent memory leaks in IE
          return str;
        }

        /**
         * Takes a DOM Node and returns the string representation of the node
         */
        function nodeToString(node) {
          if (node === null) return null;
          var tmpNode = document.createElement("div");
          tmpNode.appendChild(node.cloneNode(true));
          var str = tmpNode.innerHTML.slice(0, 70);
          tmpNode = node = null; // prevent memory leaks in IE
          return str;
        }

        /**
         * Takes a Mutation and console logs the string representation of the node
         * @param {MutationRecord[]} mutations
         */
        function processMutations(mutations) {
          for (const mutation of mutations) {
            console.log(
              "mutation",
              JSON.stringify({
                nodeName: mutation.target.nodeName,
                mutationType: mutation.type,
                addedNodes:
                  mutation.addedNodes.length > 0
                    ? Array.from(mutation.addedNodes).map((node) => ({
                        nodeName: node.nodeName,
                        node: nodeToString(node),
                      }))
                    : [],
                removedNodes:
                  mutation.removedNodes.length > 0
                    ? Array.from(mutation.addedNodes).map((node) => ({
                        nodeName: node.nodeName,
                        node: nodeToString(node),
                      }))
                    : [],
                previousSibling: {
                  node: nodeToString(mutation.previousSibling),
                  nodeName: mutation.previousSibling?.nodeName,
                },
                nextSibling: {
                  node: nodeToString(mutation.nextSibling),
                  nodeName: mutation.nextSibling?.nodeName,
                },
                node: mutationToString(mutation),
              })
            );
          }
        }

        await takeScreenshot("pre");

        const observer = new MutationObserver(processMutations);
        observer.observe(document.body, {
          attributes: true,
          childList: true,
          subtree: true,
        });

        let time = performance.now();
        window.run();
        time = performance.now() - time;

        // Process pending mutations
        let mutations = observer.takeRecords();
        observer.disconnect();
        processMutations(mutations);

        await takeScreenshot("post");

        return { time };
      });

      const hostname = new URL(page.url()).hostname;
      // check if the screenshots directory exists
      const screenshotsDir = join(dirname, "./screenshots/", hostname);
      if (!existsSync(screenshotsDir)) {
        // create a directory to store the screenshots
        mkdirSync(screenshotsDir, { recursive: true });
      }

      const pathToPre = join(screenshotsDir, "pre.png");
      const pathToPost = join(screenshotsDir, "post.png");
      const pre_img = PNG.sync.read(readFileSync(pathToPre));
      const post_img = PNG.sync.read(readFileSync(pathToPost));
      const { width, height } = pre_img;
      const diff_image = new PNG({ width, height });
      const diff = pixelmatch(
        pre_img.data,
        post_img.data,
        diff_image.data,
        width,
        height,
        {
          threshold: 0.1,
        }
      );

      console.log(diff);
      writeFileSync(
        join(screenshotsDir, "diff.png"),
        PNG.sync.write(diff_image)
      );

      writeFileSync("./results.md", `| ${hostname} | ${time} | ${diff} |\n`, {
        mode: 0o777,
        flag: "a",
      });

      console.log(`Time to hydrate: ${time}ms`);

      await page.close();
    } catch (e) {
      console.error(e);
      await browser.close();
    }
  }

  writeFileSync(
    join(dirname, "./mutation-observer-results.json"),
    JSON.stringify(allMutations, null, 2)
  );

  await browser.close();
})();
