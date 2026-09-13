import re
import zipfile

with zipfile.ZipFile(r"F:/list.xlsx") as z:
    xml = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
rows = re.findall(r"<row[^>]*>", xml)
for r in rows[:10]:
    print(r)
print("...")
print("total rows:", len(rows))
print("rows with customHeight:", sum(1 for r in rows if "customHeight" in r))
print("rows with ht=:", sum(1 for r in rows if " ht=" in r))
