import fs from "node:fs";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

fs.mkdirSync("public/images", { recursive: true });
fs.mkdirSync("src/app/fonts", { recursive: true });
const groups = {
  "discover-desktop": ["kona", "dune", "marrow", "linden", "map-preview"],
  "detail-desktop": ["kona-interior", "pour-over", "window-seat"],
  "library-desktop": [
    "journal-kona",
    "journal-marrow",
    "journal-dune",
    "ninth-street",
    "journal-linden",
  ],
};
const manifest = [];
for (const [screen, names] of Object.entries(groups)) {
  const html = fs.readFileSync(`design/stitch/${screen}.html`, "utf8");
  const urls = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map((match) => match[1])
    .slice(1);
  for (let index = 0; index < names.length; index++) {
    const name = names[index];
    const source = `design/stitch/${name}-source.png`;
    if (!fs.existsSync(`public/images/${name}.webp`)) {
      execFileSync("curl.exe", [
        "-f",
        "-L",
        "--silent",
        "--show-error",
        "--max-time",
        "45",
        urls[index],
        "-o",
        source,
      ]);
      await sharp(source)
        .resize({
          width: name === "kona-interior" ? 1500 : 900,
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(`public/images/${name}.webp`);
    }
    manifest.push({
      screen,
      name,
      sourceUrl: urls[index],
      path: `/images/${name}.webp`,
    });
    console.log(`Saved ${name}`);
  }
}
const mapUrl = fs
  .readFileSync("design/stitch/discover-desktop.html", "utf8")
  .match(/background-image: url\('(https:[^']+)'\)/)[1];
if (!fs.existsSync("public/images/neighborhood-map.webp")) {
  execFileSync("curl.exe", [
    "-f",
    "-L",
    "--silent",
    "--show-error",
    mapUrl,
    "-o",
    "design/stitch/neighborhood-map-source.png",
  ]);
  await sharp("design/stitch/neighborhood-map-source.png")
    .resize({ width: 1100, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile("public/images/neighborhood-map.webp");
}
manifest.push({
  screen: "discover-desktop",
  name: "neighborhood-map",
  sourceUrl: mapUrl,
  path: "/images/neighborhood-map.webp",
});
const fonts = [
  [
    "manrope",
    "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap",
  ],
  [
    "newsreader",
    "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap",
  ],
];
for (const [name, url] of fonts) {
  if (fs.existsSync(`src/app/fonts/${name}-0.ttf`)) continue;
  const css = execFileSync(
    "curl.exe",
    ["-f", "-L", "--silent", "--show-error", "-A", "Mozilla/5.0", url],
    { encoding: "utf8" },
  );
  const urls = [
    ...new Set(
      [...css.matchAll(/url\((https:[^)]+)\)/g)].map((match) => match[1]),
    ),
  ];
  for (let index = 0; index < urls.length; index++) {
    const extension = urls[index].endsWith(".ttf") ? "ttf" : "woff2";
    execFileSync("curl.exe", [
      "-f",
      "-L",
      "--silent",
      "--show-error",
      urls[index],
      "-o",
      `src/app/fonts/${name}-${index}.${extension}`,
    ]);
  }
  fs.writeFileSync(`design/stitch/${name}-fonts.css`, css);
  console.log(`Saved ${name} fonts (${urls.length})`);
}
fs.writeFileSync(
  "design/stitch/assets.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
