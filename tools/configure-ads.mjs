import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const require = createRequire(import.meta.url);
const adsConfigPath = new URL("../public/ads.js", import.meta.url);
const adsTxtPath = new URL("../public/ads.txt", import.meta.url);

global.window = {};
require("../public/ads.js");

const currentConfig = global.window.AD_CONFIG || {};
const args = parseArgs(process.argv.slice(2));
const rl = createInterface({ input, output });

try {
  const client = await getValue(args, "client", "AdSense client ID (ca-pub-...)");
  const slot = await getValue(args, "slot", "AdSense slot ID");

  validateClient(client);
  validateSlot(slot);

  const config = {
    ...currentConfig,
    enabled: true,
    provider: "adsense",
    adsenseClient: client,
    adsenseSlot: slot,
    adsenseFormat: currentConfig.adsenseFormat || "auto",
    fullWidthResponsive: currentConfig.fullWidthResponsive !== false,
    showPlaceholder: false
  };
  const adsTxt = `google.com, ${client.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\r\n`;

  if (args["dry-run"] === "true" || args["dry-run"] === "1") {
    console.log("Dry run OK. Ads config valid, no file changed.");
  } else {
    await writeFile(adsConfigPath, renderAdsConfig(config), "utf8");
    await writeFile(adsTxtPath, adsTxt, "utf8");
    console.log("Configured AdSense in public/ads.js and public/ads.txt");
  }
} finally {
  rl.close();
}

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const value = rawArgs[index];

    if (!value.startsWith("--")) {
      continue;
    }

    const [key, inlineValue] = value.slice(2).split("=", 2);
    parsed[key] = inlineValue ?? rawArgs[index + 1] ?? "";

    if (inlineValue === undefined) {
      index += 1;
    }
  }

  return parsed;
}

async function getValue(args, key, label) {
  if (args[key] !== undefined) {
    return String(args[key]).trim();
  }

  const answer = await rl.question(`${label}: `);
  return answer.trim();
}

function validateClient(client) {
  if (!/^ca-pub-\d{16}$/.test(client)) {
    throw new Error("AdSense client ID must look like ca-pub-1234567890123456.");
  }
}

function validateSlot(slot) {
  if (!/^\d+$/.test(slot)) {
    throw new Error("AdSense slot ID must contain digits only.");
  }
}

function renderAdsConfig(config) {
  return `window.AD_CONFIG = ${JSON.stringify(config, null, 2).replace(
    /\n/g,
    "\r\n"
  )};\r\n`;
}
