import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const require = createRequire(import.meta.url);
const linksPath = new URL("../public/links.js", import.meta.url);
const validAccents = new Set(["blue", "green", "amber", "rose", "violet"]);
const validIcons = new Set([
  "badge",
  "book",
  "bookOpen",
  "building",
  "calendar",
  "clock",
  "home",
  "key",
  "layers",
  "library",
  "lifeBuoy",
  "mail",
  "map",
  "phone",
  "printer",
  "route",
  "utensils",
  "user",
  "wifi"
]);

global.window = {};
require("../public/links.js");

const config = global.window.SCHOOL_CONFIG || {};
const links = Array.isArray(global.window.SCHOOL_LINKS)
  ? global.window.SCHOOL_LINKS
  : [];

const args = parseArgs(process.argv.slice(2));
const rl = createInterface({ input, output });

try {
  const link = await collectLink(args);
  validateLink(link, links);

  links.push(link);
  links.sort((first, second) => first.title.localeCompare(second.title));

  if (args["dry-run"] === "true" || args["dry-run"] === "1") {
    console.log("Dry run OK. Link valid, no file changed.");
  } else {
    await writeFile(linksPath, renderLinksFile(config, links), "utf8");
    console.log(`Added "${link.title}" to public/links.js`);
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

async function collectLink(args) {
  const existingCategories = [...new Set(links.map((link) => link.category))]
    .filter(Boolean)
    .sort();
  const existingSchools = [...new Set(links.map((link) => link.school))]
    .filter(Boolean)
    .sort();

  const link = {
    school: await getOptionalValue(
      args,
      "school",
      `School (${existingSchools.join(", ") || "CVUT"})`,
      "CVUT"
    ),
    title: await getValue(args, "title", "Title"),
    url: await getValue(args, "url", "URL"),
    category: await getValue(
      args,
      "category",
      `Category (${existingCategories.join(", ") || "Study"})`
    ),
    description: await getValue(args, "description", "Description"),
    tags: splitList(await getOptionalValue(args, "tags", "Tags, comma separated")),
    icon: await getOptionalValue(args, "icon", "Icon", "route"),
    accent: await getOptionalValue(args, "accent", "Accent", "blue")
  };

  if (args.featured === "true" || args.featured === "1") {
    link.featured = true;
  }

  return link;
}

async function getValue(args, key, label) {
  const value = await getOptionalValue(args, key, label);

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

async function getOptionalValue(args, key, label, fallback = "") {
  if (args[key] !== undefined) {
    return String(args[key]).trim();
  }

  if (fallback && !input.isTTY) {
    return fallback;
  }

  const suffix = fallback ? ` [${fallback}]` : "";
  const answer = await rl.question(`${label}${suffix}: `);
  return answer.trim() || fallback;
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function validateLink(link, existingLinks) {
  let url;

  try {
    url = new URL(link.url);
  } catch (error) {
    throw new Error("URL must be valid.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("URL must start with http:// or https://.");
  }

  if (!link.school) {
    throw new Error("School is required.");
  }

  if (
    existingLinks.some(
      (existing) => existing.school === link.school && existing.title === link.title
    )
  ) {
    throw new Error(
      `A link titled "${link.title}" already exists for "${link.school}".`
    );
  }

  if (existingLinks.some((existing) => existing.url === link.url)) {
    throw new Error(`A link with URL "${link.url}" already exists.`);
  }

  if (!validAccents.has(link.accent)) {
    throw new Error(`Accent must be one of: ${[...validAccents].join(", ")}.`);
  }

  if (!validIcons.has(link.icon)) {
    throw new Error(`Icon must be one of: ${[...validIcons].join(", ")}.`);
  }
}

function renderLinksFile(config, links) {
  return `window.SCHOOL_CONFIG = ${stringify(config)};\n\nwindow.SCHOOL_LINKS = ${stringify(
    links
  )};\n`;
}

function stringify(value) {
  return JSON.stringify(value, null, 2).replace(/\n/g, "\r\n");
}
