import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const THREAD = "01a08fb6-a388-7aa2-a39a-abdda8d2f963";
const OUT_FILE = `C:/Users/lenovo/.codex/visualizations/2026/09/11/${THREAD}/outputs/${THREAD}/list_package_names.xlsx`;

const outWb = await SpreadsheetFile.importXlsx(await FileBlob.load(OUT_FILE));
const sheet = outWb.worksheets.getItemAt(0);
const blob = await outWb.render({ sheetName: sheet.name, range: "A1:J8", scale: 1, format: "png" });
await fs.writeFile("out_rows8.png", new Uint8Array(await blob.arrayBuffer()));

// row heights actually stored in the delivered file
const heights = [];
for (let r = 1; r <= 12; r++) heights.push(sheet.getRange(`A${r}:A${r}`).format.rowHeight ?? null);
console.log("delivered row heights (first 12):", JSON.stringify(heights));
console.log("C column width:", sheet.getRange("C1").format.columnWidth, "| J column width:", sheet.getRange("J1").format.columnWidth);
