import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { splitLinks, packageFromUrl, detectPlatform } from "./parse_lib.mjs";

const THREAD = "01a08fb6-a388-7aa2-a39a-abdda8d2f963";
const OUT_FILE = `C:/Users/lenovo/.codex/visualizations/2026/09/11/${THREAD}/outputs/${THREAD}/list_package_names.xlsx`;

// source
const srcWb = await SpreadsheetFile.importXlsx(await FileBlob.load("F:/list.xlsx"));
const src = srcWb.worksheets.getItemAt(0).getRange("A1:I81").values;

// output
const outWb = await SpreadsheetFile.importXlsx(await FileBlob.load(OUT_FILE));
const sheet = outWb.worksheets.getItemAt(0);
const used = sheet.getUsedRange().address;
const rows = sheet.getRange(used).values;

const problems = [];
const header = rows[0];
if (header[9] !== "Package name:") problems.push(`header J1 = ${JSON.stringify(header[9])}`);
for (let i = 0; i < 9; i++) if (JSON.stringify(header[i]) !== JSON.stringify(src[0][i])) problems.push(`header ${i} changed`);

// collect source link items per row
const srcItems = new Map();
const srcUrlCount = new Map();
for (let r = 1; r < src.length; r++) {
  const items = splitLinks(src[r][2]);
  srcItems.set(r + 1, items);
  srcUrlCount.set(r + 1, items.filter((i) => i.url).length);
}

// walk output rows, group them back to source rows: output row count per source row = item count
let cursor = 1;
let checked = 0;
let blanks = [];
const outUrls = [];

for (let r = 1; r < src.length; r++) {
  const items = srcItems.get(r + 1);
  const count = items.length || 1;
  for (let k = 0; k < count; k++) {
    const row = rows[cursor];
    if (!row) { problems.push(`missing output row ${cursor + 1}`); break; }
    const expected = items[k] || { url: "", raw: "" };
    const cell = row[2];
    const expectCell = expected.url || expected.raw;
    if ((cell ?? "") !== expectCell) problems.push(`row ${cursor + 1}: link cell ${JSON.stringify(cell)} != ${JSON.stringify(expectCell)}`);
    const expectPkg = expected.pkg || null;
    if ((row[9] ?? null) !== expectPkg) problems.push(`row ${cursor + 1}: pkg ${JSON.stringify(row[9])} != ${JSON.stringify(expectPkg)}`);
    // other columns must match source row
    for (const [oi, si] of [[1, 1], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8]]) {
      if (JSON.stringify(row[oi] ?? null) !== JSON.stringify(src[r][si] ?? null)) {
        problems.push(`row ${cursor + 1}: col ${oi} ${JSON.stringify(row[oi]).slice(0, 40)} != source`);
      }
    }
    if (cell && /https?:\/\//.test(String(cell))) outUrls.push(String(cell));
    if (!row[9]) blanks.push(`${row[1]} :: ${String(cell).slice(0, 70)}`);
    checked++;
    cursor++;
  }
}

// every source URL must appear exactly once in the output
const srcUrlList = [];
for (let r = 1; r < src.length; r++) for (const it of srcItems.get(r + 1)) if (it.url) srcUrlList.push(it.url);
const missing = srcUrlList.filter((u) => !outUrls.includes(u));
const extra = outUrls.filter((u) => !srcUrlList.includes(u));
if (missing.length) problems.push(`URLs missing from output: ${missing.length}`);
if (extra.length) problems.push(`unexpected URLs in output: ${extra.length}`);

const drawings = await outWb.inspect({ kind: "drawing", sheetId: sheet.name, maxChars: 20000 });
const drawCount = drawings.ndjson.split("\n").filter(Boolean).length;

const preview = await outWb.render({ sheetName: sheet.name, range: `A1:J12`, scale: 1, format: "png" });
await fs.writeFile("out_preview.png", new Uint8Array(await preview.arrayBuffer()));
const errors = await outWb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
});

console.log("used range:", used, "| output rows (incl header):", rows.length);
console.log("checked rows:", checked, "| source URLs:", srcUrlList.length, "| output URLs:", outUrls.length);
console.log("images in output:", drawCount);
console.log("formula errors:", errors.ndjson.trim() || "none");
console.log("problems:", problems.length);
problems.slice(0, 40).forEach((p) => console.log("  -", p));
console.log(`rows without a package name (${blanks.length}):`);
blanks.forEach((b) => console.log("  *", b));
