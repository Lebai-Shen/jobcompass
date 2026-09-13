import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

for (const addr of ["A1", "B2", "C2", "D2", "I2", "J1", "A2"]) {
  const st = await workbook.inspect({ kind: "computedStyle", sheetId: sheet.name, range: addr, maxChars: 1200 });
  console.log(addr, st.ndjson.split("\n").filter((l) => l.includes("style")).map((l) => l.replace(/"styleId".*/, "")).join(" "));
}

const heights = [];
for (let r = 1; r <= 81; r++) {
  heights.push(sheet.getRange(`A${r}:A${r}`).format.rowHeight ?? null);
}
console.log("heights:", JSON.stringify(heights));

const preview = await workbook.render({ sheetName: sheet.name, range: "A1:I8", scale: 1, format: "png" });
await fs.writeFile("source.png", new Uint8Array(await preview.arrayBuffer()));
console.log("rendered");
