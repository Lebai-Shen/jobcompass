import re
import zipfile

with zipfile.ZipFile(r"F:/list.xlsx") as z:
    sheet_xml = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
    m = re.search(r"<sheetFormatPr[^>]*>", sheet_xml)
    print("sheetFormatPr:", m.group(0) if m else "none")
    m = re.search(r"<cols>.*?</cols>", sheet_xml, re.S)
    print("cols:", m.group(0) if m else "none")
