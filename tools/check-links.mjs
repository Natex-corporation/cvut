import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const source = await readFile(path.join(root, "public", "links.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { filename: "public/links.js" });
const links = context.window.SCHOOL_LINKS || [];

const results = await mapWithConcurrency(links, 8, checkLink);
const unverified = results.filter((result) => result.ok === null);
const failed = results.filter((result) => result.ok === false);
const redirected = results.filter(
  (result) => result.ok && normalizeUrl(result.requestedUrl) !== normalizeUrl(result.finalUrl)
);

console.log(
  `Checked ${results.length} links: ${results.length - failed.length - unverified.length} reachable, ${failed.length} failed, ${unverified.length} unverified, ${redirected.length} redirected.`
);

if (redirected.length > 0) {
  console.log("\nRedirected URLs worth reviewing:");
  redirected.forEach((result) => {
    console.log(`- ${result.title}: ${result.requestedUrl} -> ${result.finalUrl}`);
  });
}

if (unverified.length > 0) {
  console.warn("\nURLs that could not be verified from this network:");
  unverified.forEach((result) => {
    console.warn(`- ${result.title}: ${result.requestedUrl} (${result.detail})`);
  });
}

if (failed.length > 0) {
  console.error("\nUnreachable URLs:");
  failed.forEach((result) => {
    console.error(`- ${result.title}: ${result.requestedUrl} (${result.detail})`);
  });
  process.exitCode = 1;
}

async function checkLink(link) {
  const base = {
    title: link.title,
    requestedUrl: link.url,
    finalUrl: link.url
  };

  try {
    let response = await request(link.url, "HEAD");
    if (response.status >= 400) {
      response = await request(link.url, "GET");
    }

    const reachable = response.status < 400 || [401, 403, 429].includes(response.status);
    return {
      ...base,
      ok: reachable,
      finalUrl: response.url || link.url,
      detail: `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ...base,
      ok: null,
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
    headers: {
      "User-Agent": "CVUT-Crossroad-Link-Checker/1.0",
      Accept: "text/html,application/xhtml+xml"
    }
  });
}

function normalizeUrl(url) {
  return String(url || "").replace(/\/$/, "").toLowerCase();
}

async function mapWithConcurrency(values, limit, callback) {
  const output = new Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      output[index] = await callback(values[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return output;
}
