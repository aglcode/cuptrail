import { writeFile } from 'node:fs/promises';

const fonts = [
  ['figtree.ttf', 'figtree/Figtree[wght].ttf'],
  ['nunito-sans.ttf', 'nunitosans/NunitoSans[YTLC,opsz,wdth,wght].ttf'],
  ['figtree-OFL.txt', 'figtree/OFL.txt'],
  ['nunito-sans-OFL.txt', 'nunitosans/OFL.txt'],
];

for (const [file, source] of fonts) {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${source}`);
  if (!response.ok) throw new Error(`${source}: ${response.status}`);
  await writeFile(new URL(`../app/fonts/${file}`, import.meta.url), Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${file}`);
}
