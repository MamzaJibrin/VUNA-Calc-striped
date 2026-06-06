const CI = process.argv.includes("--ci");

let playwright;
try {
  playwright = await import("@playwright/test");
} catch {
  console.log("Playwright not installed. Open tests/index.html in a browser.");
  process.exit(CI ? 1 : 0);
}

import { createServer } from "http";
import { readFileSync } from "fs";
import { join, extname } from "path";

const PORT = 8765;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer((req, res) => {
  const filePath = join(process.cwd(), req.url === "/" ? "/tests/index.html" : req.url);
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT);

async function tryLaunch() {
  try {
    const browser = await playwright.chromium.launch({ channel: "chrome", headless: true });
    return { browser, name: "Chrome" };
  } catch { /* system Chrome unavailable */ }

  if (CI) {
    const browser = await playwright.chromium.launch({ headless: true });
    return { browser, name: "Chromium" };
  }

  throw new Error("No browser available. Open tests/index.html manually.");
}

let passed = true;

try {
  const { browser, name } = await tryLaunch();
  console.log(`  http://localhost:${PORT}/tests/index.html  (${name})`);

  const page = await browser.newPage();
  page.on("pageerror", (err) => console.log("  [error]", err.message));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load", timeout: 10000 });

  // Poll DOM for QUnit results instead of using QUnit.done callback
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const poll = () => {
        const el = document.getElementById("qunit-testresult");
        if (el && !el.textContent.includes("…")) {
          const passed = parseInt(el.querySelector(".passed")?.textContent || "0", 10);
          const failed = parseInt(el.querySelector(".failed")?.textContent || "0", 10);
          const total = parseInt(el.querySelector(".total")?.textContent || "0", 10);
          const runtime = el.textContent.match(/(\d+)\s*ms/)?.[1] || "0";
          resolve({ passed, failed, total, runtime: parseInt(runtime, 10) });
        } else {
          setTimeout(poll, 200);
        }
      };
      poll();
    });
  });

  console.log(`\n  Passed: ${result.passed}  |  Failed: ${result.failed}  |  Total: ${result.total}  |  ${result.runtime}ms`);
  passed = result.failed === 0;

  if (!passed) {
    const failures = await page.evaluate(() => {
      const items = document.querySelectorAll("li.fail[id^='qunit-test-output']");
      return Array.from(items).map((el) => ({
        name: el.querySelector(".test-name")?.textContent,
        message: el.querySelector(".test-message")?.textContent,
      }));
    });
    console.log("\n  Failures:");
    failures.forEach((f) => console.log(`    ❌ ${f.name}${f.message ? ": " + f.message : ""}`));
  }

  await browser.close();
} catch (err) {
  console.error(`  ${err.message}`);
  passed = false;
} finally {
  server.close();
  process.exit(passed ? 0 : 1);
}
