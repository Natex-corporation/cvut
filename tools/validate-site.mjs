import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const errors = [];

const files = await readdir(publicDir);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

const linksSource = await readFile(path.join(publicDir, "links.js"), "utf8");
const linksContext = { window: {} };
vm.runInNewContext(linksSource, linksContext, { filename: "public/links.js" });

const links = linksContext.window.SCHOOL_LINKS;
if (!Array.isArray(links) || links.length === 0) {
  errors.push("public/links.js must define a non-empty SCHOOL_LINKS array.");
}

const seenTitles = new Set();
const seenUrls = new Set();
const requiredFields = ["school", "title", "url", "category", "description"];

for (const [index, link] of (links || []).entries()) {
  for (const field of requiredFields) {
    if (!String(link[field] || "").trim()) {
      errors.push(`Link ${index + 1} is missing ${field}.`);
    }
  }

  try {
    const url = new URL(link.url);
    if (url.protocol !== "https:") {
      errors.push(`${link.title || `Link ${index + 1}`} should use HTTPS.`);
    }
  } catch {
    errors.push(`${link.title || `Link ${index + 1}`} has an invalid URL.`);
  }

  const titleKey = `${link.school}\u0000${link.title}`.toLowerCase();
  if (seenTitles.has(titleKey)) {
    errors.push(`Duplicate school/title: ${link.school} / ${link.title}.`);
  }
  seenTitles.add(titleKey);

  const urlKey = String(link.url || "").replace(/\/$/, "").toLowerCase();
  if (seenUrls.has(urlKey)) {
    errors.push(`Duplicate URL: ${link.url}.`);
  }
  seenUrls.add(urlKey);
}

for (const htmlFile of htmlFiles) {
  const html = await readFile(path.join(publicDir, htmlFile), "utf8");
  if (!/<html\s+lang="[^"]+"/i.test(html)) {
    errors.push(`${htmlFile} is missing a document language.`);
  }
  if (!/<meta\s+name="description"/i.test(html)) {
    errors.push(`${htmlFile} is missing a meta description.`);
  }
  if (!/<link\s+rel="canonical"/i.test(html) && htmlFile !== "404.html") {
    errors.push(`${htmlFile} is missing a canonical URL.`);
  }
  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`${htmlFile} is missing a title.`);
  }

  const localAssets = [
    ...html.matchAll(/(?:src|href)="\.\/([^"?#]+\.(?:css|js|png|webp|jpg|jpeg|webmanifest))(?:\?[^"#]*)?"/gi)
  ];
  for (const match of localAssets) {
    if (!files.includes(match[1])) {
      errors.push(`${htmlFile} references missing asset ${match[1]}.`);
    }
  }
}

const adsSource = await readFile(path.join(publicDir, "ads.js"), "utf8");
const adsContext = { window: {} };
vm.runInNewContext(adsSource, adsContext, { filename: "public/ads.js" });
const ads = adsContext.window.AD_CONFIG || {};
if (ads.enabled && !/^ca-pub-\d{16}$/.test(String(ads.adsenseClient || ""))) {
  errors.push("Enabled AdSense config needs a valid 16-digit publisher ID.");
}

const sitemap = await readFile(path.join(publicDir, "sitemap.xml"), "utf8");
for (const route of ["/", "/guide", "/checklist", "/roadmap", "/about", "/sources", "/privacy", "/contact"]) {
  const url = `https://cvut-crossroad.com${route}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    errors.push(`sitemap.xml is missing ${url}.`);
  }
}

if (errors.length > 0) {
  console.error(`Site validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const categories = new Set(links.map((link) => link.category));
  console.log(
    `Site validation passed: ${htmlFiles.length} HTML pages, ${links.length} links, ${categories.size} categories.`
  );
}
