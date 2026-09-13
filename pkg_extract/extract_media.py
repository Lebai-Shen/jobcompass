import os
import zipfile

src = r"F:/list.xlsx"
out = r"F:/Occupation/pkg_extract/media"
os.makedirs(out, exist_ok=True)

with zipfile.ZipFile(src) as z:
    names = [n for n in z.namelist() if n.startswith("xl/media/")]
    for n in names:
        data = z.read(n)
        with open(os.path.join(out, os.path.basename(n)), "wb") as f:
            f.write(data)
        print(os.path.basename(n), len(data))
