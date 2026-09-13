import zipfile

p = r"C:/Users/lenovo/.codex/visualizations/2026/09/11/01a08fb6-a388-7aa2-a39a-abdda8d2f963/outputs/01a08fb6-a388-7aa2-a39a-abdda8d2f963/list_package_names.xlsx"
with zipfile.ZipFile(p) as z:
    print(sorted(z.namelist()))
    xml = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
    print("len:", len(xml))
    print(xml[:1500])
