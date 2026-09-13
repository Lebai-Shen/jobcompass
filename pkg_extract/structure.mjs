import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

for (const kind of ["drawing", "thread", "definedName", "region"]) {
  const res = await workbook.inspect({ kind, sheetId: sheet.name, maxChars: 2000 });
  console.log(kind, "->", res.ndjson.slice(0, 1500));
}
console.log("gridlines:", sheet.showGridLines);
console.log("merges:", JSON.stringify(sheet.getUsedRange().format.merged));
console.log("cf:", sheet.conditionalFormattings ? sheet.conditionalFormattings.items.length : "n/a");
console.log("dv:", sheet.dataValidations ? sheet.dataValidations.items.length : "n/a");

for (const col of ["A", "B", "C", "D", "E", "F", "G", "H", "I"]) {
  const r = sheet.getRange(`${col}1:${col}81`);
  console.log(col, "hidden:", r.format.hidden ?? null);
}
const rowsHidden = [];
for (let i = 1; i <= 81; i++) if (sheet.getRange(`A${i}`).format.hidden) rowsHidden.push(i);
console.log("hiddenRows:", JSON.stringify(rowsHidden));
