import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

const info = await workbook.inspect({
  kind: "sheet,table",
  sheetId: sheet.name,
  maxChars: 4000,
});
console.log(info.ndjson);

const style = await workbook.inspect({
  kind: "computedStyle",
  sheetId: sheet.name,
  range: "A1:J3",
  maxChars: 6000,
});
console.log(style.ndjson);

const used = sheet.getUsedRange();
console.log("usedRange:", JSON.stringify(used.address));
console.log("freeze:", JSON.stringify(sheet.freezePanes.getLocation ? sheet.freezePanes.getLocation() : null));
for (const t of sheet.tables.items) {
  console.log("table:", t.name, t.style, t.showHeaders, t.address ?? "");
}
