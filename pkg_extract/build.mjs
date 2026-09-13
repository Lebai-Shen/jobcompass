import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import { splitLinks } from "./parse_lib.mjs";

const SRC = "F:/list.xlsx";
const MEDIA = "F:/Occupation/pkg_extract/media";
const THREAD = "01a08fb6-a388-7aa2-a39a-abdda8d2f963";
const OUT_DIR = `C:/Users/lenovo/.codex/visualizations/2026/09/11/${THREAD}/outputs/${THREAD}`;
const OUT_FILE = `${OUT_DIR}/list_package_names.xlsx`;

const FONT = "Calibri";
const HEADER_FONT = "Verdana";
const BORDER = { preset: "all", style: "medium", color: "#CCCCCC" };

// ---------- read source ----------
const input = await FileBlob.load(SRC);
const srcWb = await SpreadsheetFile.importXlsx(input);
const srcSheet = srcWb.worksheets.getItemAt(0);
const values = srcSheet.getRange("A1:I81").values;
const header = values[0];
const rowHeights = [];
for (let r = 1; r <= values.length; r++) {
  rowHeights.push(srcSheet.getRange(`A${r}:A${r}`).format.rowHeight ?? 15);
}

const drawingInspect = await srcWb.inspect({ kind: "drawing", sheetId: srcSheet.name, maxChars: 20000 });
const drawings = drawingInspect.ndjson
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .map((d) => ({
    file: `${MEDIA}/${d.id.split("/").pop()}`,
    srcRow: d.anchor.from.row + 1, // 1-based sheet row
    widthPx: Math.round(d.anchor.to.colOffsetPx),
    heightPx: Math.round(d.anchor.to.rowOffsetPx),
  }));

// ---------- build rows ----------
const HEADERS = [...header.slice(0, 9), "Package name:"];
const rows = []; // each: array of 10 cells
const heightForRow = [rowHeights[0]]; // index 0 = header row
const srcRowToOutRow = new Map();
let splitCount = 0;

for (let r = 1; r < values.length; r++) {
  const src = values[r];
  const items = splitLinks(src[2]);
  srcRowToOutRow.set(r + 1, rows.length + 2); // 1-based sheet row of the first output row
  if (items.length > 1) splitCount++;
  const list = items.length ? items : [{ url: "", raw: "" }];
  for (const it of list) {
    rows.push([
      null,
      src[1],
      it.url || it.raw,
      src[3],
      src[4],
      src[5],
      src[6],
      src[7],
      src[8],
      it.pkg || null,
    ]);
    heightForRow.push(rowHeights[r]);
  }
}

// ---------- write workbook ----------
const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Sheet1");
const lastRow = rows.length + 1;

sheet.getRange(`A1:J1`).values = [HEADERS];
sheet.getRange(`A2:J${lastRow}`).values = rows;

// number formats: identifiers stay text
sheet.getRange(`C2:C${lastRow}`).format.numberFormat = "@";
sheet.getRange(`J2:J${lastRow}`).format.numberFormat = "@";

// header styling (mirrors source row 1)
sheet.getRange(`A1:J1`).format.fill = "#A4C2F4";
sheet.getRange(`A1:J1`).format = {
  fill: "#A4C2F4",
  font: { name: HEADER_FONT, size: 14, bold: true },
  wrapText: true,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: BORDER,
};
sheet.getRange("C1").format.font = { name: FONT, size: 14, bold: true };
sheet.getRange("J1").format.font = { name: FONT, size: 14, bold: true };

// body styling
sheet.getRange(`B2:B${lastRow}`).format = {
  font: { name: FONT, size: 14, bold: true },
  wrapText: true,
  horizontalAlignment: "left",
  verticalAlignment: "center",
  borders: BORDER,
};
sheet.getRange(`A2:A${lastRow}`).format = { borders: BORDER };
sheet.getRange(`C2:C${lastRow}`).format = {
  font: { name: FONT, size: 11, color: "#1155CC" },
  wrapText: true,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: BORDER,
};
sheet.getRange(`D2:D${lastRow}`).format = {
  font: { name: FONT, size: 11, color: "#11734B" },
  wrapText: true,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: BORDER,
};
for (const col of ["E", "F", "G", "I"]) {
  sheet.getRange(`${col}2:${col}${lastRow}`).format = {
    font: { name: FONT, size: 11 },
    wrapText: true,
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: BORDER,
  };
}
sheet.getRange(`H2:H${lastRow}`).format = {
  font: { name: FONT, size: 11, bold: true },
  wrapText: true,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: BORDER,
};
sheet.getRange(`J2:J${lastRow}`).format = {
  font: { name: FONT, size: 11 },
  wrapText: true,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: BORDER,
};

// widths
sheet.getRange("C1:C1").format.columnWidth = 66.54545593261719;
sheet.getRange("J1:J1").format.columnWidth = 34;

// row heights: mirror source rows
sheet.getRange(`A1:J1`).format.rowHeight = rowHeights[0];
for (let i = 1; i < heightForRow.length; i++) {
  const h = heightForRow[i];
  if (h && h > 15) sheet.getRange(`A${i + 1}:J${i + 1}`).format.rowHeight = h;
}

// ---------- carry over logos ----------
let imagesAdded = 0;
const imagesFailed = [];
for (const d of drawings) {
  const outRow = srcRowToOutRow.get(d.srcRow);
  if (!outRow) continue;
  try {
    const bytes = await fs.readFile(d.file);
    const dataUrl = `data:image/png;base64,${bytes.toString("base64")}`;
    sheet.images.add({
      dataUrl,
      anchor: {
        from: { row: outRow - 1, col: 0 },
        extent: { widthPx: d.widthPx || 62, heightPx: d.heightPx || 62 },
      },
    });
    imagesAdded++;
  } catch (e) {
    imagesFailed.push(`${d.file}: ${String(e).slice(0, 120)}`);
  }
}

workbook.recalculate();
await fs.mkdir(OUT_DIR, { recursive: true });
const out = await SpreadsheetFile.exportXlsx(workbook);
await out.save(OUT_FILE);

console.log(JSON.stringify({ outFile: OUT_FILE, rows: rows.length, splitCount, imagesAdded, imagesFailed, lastRow }));
