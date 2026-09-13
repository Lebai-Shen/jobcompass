import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);
const values = sheet.getRange("A1:I81").values;

await fs.writeFile("raw.json", JSON.stringify(values, null, 2), "utf8");

// Print column B (app) and C (links) for every row, plus which columns are populated.
const lines = [];
values.forEach((row, i) => {
  const filled = row.map((v, j) => (v === null || v === undefined || v === "" ? "" : String.fromCharCode(65 + j))).filter(Boolean).join("");
  lines.push(`#${i + 1} [${filled}] B=${JSON.stringify(row[1])}`);
  lines.push(`      C=${JSON.stringify(row[2])}`);
});
await fs.writeFile("dump.txt", lines.join("\n"), "utf8");
console.log("rows:", values.length);
