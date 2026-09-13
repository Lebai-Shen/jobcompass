import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { splitLinks } from "./parse_lib.mjs";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);
const values = sheet.getRange("A1:I81").values;

const lines = [];
let outRow = 0;
let split = 0;
let noPkg = [];

for (let r = 1; r < values.length; r++) {
  const src = values[r];
  const offer = src[1];
  const items = splitLinks(src[2]);
  if (items.length > 1) split++;
  if (items.length === 0) {
    lines.push(`r${r + 1} ${JSON.stringify(offer)} :: <EMPTY CELL>`);
    outRow++;
    continue;
  }
  items.forEach((it, k) => {
    outRow++;
    const flag = it.pkg ? "OK " : "?? ";
    lines.push(
      `out${outRow} <- src${r + 1}${items.length > 1 ? ` [${k + 1}/${items.length}]` : ""} ${flag}${it.platform.padEnd(8)} pkg=${JSON.stringify(
        it.pkg
      )} cell=${JSON.stringify(it.url || it.raw)}`
    );
  });
}

const dupOffers = {};
for (let r = 1; r < values.length; r++) {
  const offer = String(values[r][1]);
  dupOffers[offer] = (dupOffers[offer] || 0) + 1;
}
console.log("source data rows:", values.length - 1, "-> output rows:", outRow, "| rows split:", split);
console.log("offer names repeated:", JSON.stringify(Object.entries(dupOffers).filter(([, n]) => n > 1)));
console.log(lines.join("\n"));

await fs.writeFile("plan.txt", lines.join("\n"), "utf8");
