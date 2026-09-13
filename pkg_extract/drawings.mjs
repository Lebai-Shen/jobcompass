import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

const res = await workbook.inspect({ kind: "drawing", sheetId: sheet.name, maxChars: 20000 });
const rows = res.ndjson.split("\n").filter(Boolean).map((l) => JSON.parse(l));
console.log("drawing count:", rows.length);
const byRow = {};
for (const d of rows) {
  const key = d.anchor.from.row + 1; // 1-based spreadsheet row
  byRow[key] = byRow[key] || [];
  byRow[key].push({ img: d.id, col: d.anchor.from.col, h: d.anchor.to.rowOffsetPx, w: d.anchor.to.colOffsetPx });
}
console.log(JSON.stringify(byRow, null, 1));

try {
  console.log("images.items:", sheet.images.items.length);
} catch (e) {
  console.log("images err:", String(e).slice(0, 200));
}

// dump media files out of the xlsx container
const buf = await fs.readFile("F:/list.xlsx");
const JSZipLike = null;
console.log("zip size", buf.length);
