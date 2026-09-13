import re
import zipfile

p = r"C:/Users/lenovo/.codex/visualizations/2026/09/11/01a08fb6-a388-7aa2-a39a-abdda8d2f963/outputs/01a08fb6-a388-7aa2-a39a-abdda8d2f963/list_package_names.xlsx"
with zipfile.ZipFile(p) as z:
    names = [n for n in z.namelist() if n.startswith("xl/worksheets/")]
    print("sheets:", names)
    xml = z.read(names[0]).decode("utf-8")
rows = re.findall(r"<row[^>]*>", xml)
for r in rows[:8]:
    print(r)
print("total rows:", len(rows))
print("cols:", re.search(r"<cols>.*?</cols>", xml, re.S).group(0) if re.search(r"<cols>.*?</cols>", xml, re.S) else "none")
print("sheetFormatPr:", re.search(r"<sheetFormatPr[^>]*>", xml).group(0))
print("media:", [n for n in z.namelist() if n.startswith("xl/media/")])
print("drawings:", [n for n in z.namelist() if "drawing" in n])
