import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("F:/list.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

for (const addr of ["E2", "F2", "G2", "H2", "B5", "B40", "C40", "I40", "B1", "I1", "E1", "H1"]) {
  const st = await workbook.inspect({ kind: "computedStyle", sheetId: sheet.name, range: addr, maxChars: 1500 });
  const line = st.ndjson.split("\n").find((l) => l.includes("computedStyle"));
  if (!line) { console.log(addr, "none"); continue; }
  const s = JSON.parse(line).style;
  console.log(
    addr,
    "font:", s.font?.typeface, s.font?.fontSize, "bold:", s.font?.bold ?? false, "color:", s.font?.fill?.color?.value ?? s.font?.color?.value ?? "default",
    "| fill:", s.fill?.color?.value ?? "none",
    "| align:", s.horizontalAlignment, s.verticalAlignment ?? "-",
    "| wrap:", s.wrapText,
    "| border:", s.border?.top?.style
  );
}
