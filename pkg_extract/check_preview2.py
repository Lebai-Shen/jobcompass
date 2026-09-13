import struct

for p in [r"F:/Occupation/pkg_extract/source.png", r"F:/Occupation/pkg_extract/out_preview.png"]:
    with open(p, "rb") as f:
        data = f.read()
    w, h = struct.unpack(">II", data[16:24])
    print(p.split("/")[-1], "->", w, "x", h, "bytes:", len(data))
