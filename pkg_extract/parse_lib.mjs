// Shared parsing logic for splitting preview-link cells and extracting package names.

export function cleanUrl(u) {
  return u.replace(/[)\],;]+$/g, "").replace(/\s+$/g, "");
}

export function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes("apps.apple.com")) return "iOS";
  if (u.includes("play.google.com")) return "Android";
  if (u.endsWith(".apk")) return "APK";
  if (u.includes("onelink.me")) return "OneLink";
  if (u.includes("rustore.ru")) return "RuStore";
  return "Web";
}

export function packageFromUrl(url) {
  if (!url) return "";
  const apple = url.match(/\/id(\d+)/);
  if (url.toLowerCase().includes("apps.apple.com") && apple) return apple[1];
  const gp = url.match(/[?&]id=([^&#\s]+)/);
  if (gp) return gp[1];
  return "";
}

// Split one preview-link cell into one item per link (or per descriptive line).
export function splitLinks(cell) {
  const text = String(cell ?? "").replace(/\r\n?/g, "\n");
  const items = [];
  for (const rawLine of text.split("\n")) {
    let line = rawLine.trim().replace(/^[\s,;、]+/, "").replace(/[\s,;、]+$/, "");
    if (!line) continue;
    const urlCount = (line.match(/https?:\/\/\S+/g) || []).length;
    const parts = urlCount > 1 ? line.split(/[;,、]/) : [line];
    for (let part of parts) {
      part = part.trim().replace(/^[\s,;、]+/, "").replace(/[\s,;、]+$/, "");
      if (!part) continue;
      const urlMatch = part.match(/https?:\/\/\S+/);
      const url = urlMatch ? cleanUrl(urlMatch[0]) : "";
      items.push({ raw: part, url, platform: url ? detectPlatform(url) : "none", pkg: packageFromUrl(url) });
    }
  }
  return items;
}
