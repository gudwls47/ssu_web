/**
 * Font size scale-up script
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SCALE = {
  8: 10, 9: 11, 10: 12, 11: 13, 12: 14, 13: 15, 14: 16, 15: 17,
  16: 18, 17: 19, 18: 20, 20: 22, 22: 24, 24: 26, 26: 28, 28: 30,
  32: 36, 36: 40, 40: 44, 44: 48, 48: 52,
};

function scalePx(n) {
  const num = parseInt(n, 10);
  return SCALE[num] !== undefined ? String(SCALE[num]) : String(Math.round(num * 1.15));
}

function scaleTsx(src) {
  return src.replace(/\bfontSize:\s*(\d+)/g, (_, n) => `fontSize: ${scalePx(n)}`);
}

function scaleCss(src) {
  let out = src.replace(/\bfont-size:\s*(\d+)px/g, (_, n) => `font-size: ${scalePx(n)}px`);
  out = out.replace(/\bfont:\s*([^;]*?)(\d+)px\//g, (_, pre, n) => `font: ${pre}${scalePx(n)}px/`);
  out = out.replace(/clamp\((\d+)px,([^,]+),(\d+)px\)/g, (_, lo, mid, hi) =>
    `clamp(${scalePx(lo)}px,${mid},${scalePx(hi)}px)`
  );
  return out;
}

function walk(dir, exts, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
      walk(full, exts, files);
    } else if (exts.some(e => full.endsWith(e))) {
      files.push(full);
    }
  }
  return files;
}

const srcDir = path.join(root, "src");
let changed = 0;

for (const full of walk(srcDir, [".tsx", ".ts"])) {
  const src = readFileSync(full, "utf8");
  const out = scaleTsx(src);
  if (out !== src) {
    writeFileSync(full, out, "utf8");
    console.log("  tsx:", path.relative(root, full));
    changed++;
  }
}

for (const full of walk(srcDir, [".css"])) {
  const src = readFileSync(full, "utf8");
  const out = scaleCss(src);
  if (out !== src) {
    writeFileSync(full, out, "utf8");
    console.log("  css:", path.relative(root, full));
    changed++;
  }
}

console.log(`\nDone — ${changed} file(s) modified.`);
