import struct

p = r"F:/Occupation/pkg_extract/out_preview.png"
with open(p, "rb") as f:
    data = f.read()
print("bytes:", len(data))
w, h = struct.unpack(">II", data[16:24])
print("png size:", w, "x", h)

try:
    from PIL import Image
    im = Image.open(p).convert("RGB")
    cols = im.getcolors(maxcolors=1000000)
    cols.sort(reverse=True)
    print("distinct colors:", len(cols))
    print("top colors:", cols[:5])
except Exception as e:
    print("PIL unavailable:", e)
