import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

console.log("tables:", sheet.tables.items.length);
for (const t of sheet.tables.items) {
  console.log(JSON.stringify({ name: t.name, style: t.style, showHeaders: t.showHeaders, showTotals: t.showTotals, range: t.getRange ? t.getRange().address : null }));
}

const st = await workbook.inspect({
  kind: "computedStyle",
  sheetId: sheet.name,
  range: "A1:A3,C2,D2,I2,B40",
  maxChars: 6000,
});
console.log(st.ndjson);

for (const col of ["A", "B", "C", "D", "E", "F", "G", "H", "I"]) {
  try {
    const f = sheet.getRange(`${col}1:${col}5`).format;
    console.log(col, "width:", f.columnWidth, "px:", f.columnWidthPx);
  } catch (e) {
    console.log(col, "err", String(e).slice(0, 120));
  }
}
console.log("row1 height:", sheet.getRange("A1:A1").format.rowHeight);
console.log("row2 height:", sheet.getRange("A2:A2").format.rowHeight);
