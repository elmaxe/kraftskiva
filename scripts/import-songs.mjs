// Bulk-import songs from a plain-text file into src/data/songs/*.json
//
//   node scripts/import-songs.mjs visor.txt
//
// Format — one block per song, started by a "# " heading. "Mel:", "Kategori:"
// and "Text:" lines directly under the heading are optional metadata; the rest
// is lyrics, with verses separated by blank lines.
//
//   # Kräftans lov
//   Mel: Hej tomtegubbar
//   Kategori: Snapsvisa
//   Text: Trad.
//
//   Första raden
//   Andra raden
//
//   Andra versen

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'songs')

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const META = {
  'mel': 'melody',
  'melodi': 'melody',
  'kategori': 'category',
  'text': 'author',
  'författare': 'author',
}

function parse(source) {
  return source
    .replace(/\r\n/g, '\n')
    .split(/^#\s+/m)
    .slice(1) // drop anything before the first heading
    .map((block) => {
      const [heading, ...rest] = block.split('\n')
      const song = { title: heading.trim() }

      // Consume leading metadata lines.
      while (rest.length) {
        const match = /^([A-Za-zÅÄÖåäö]+):\s*(.+)$/.exec(rest[0].trim())
        const key = match && META[match[1].toLowerCase()]
        if (!key) break
        song[key] = key === 'melody' && !/^mel:/i.test(match[2])
          ? `Mel: ${match[2].trim()}`
          : match[2].trim()
        rest.shift()
      }

      song.lyrics = rest.join('\n').replace(/\n{3,}/g, '\n\n').trim()
      return song
    })
    .filter((song) => song.title && song.lyrics)
}

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/import-songs.mjs <file.txt>')
  process.exit(1)
}

let written = 0
for (const song of parse(readFileSync(input, 'utf8'))) {
  const slug = slugify(song.title)
  const path = join(OUT_DIR, `${slug}.json`)
  if (existsSync(path)) {
    console.warn(`skip  ${slug}.json (already exists)`)
    continue
  }
  writeFileSync(path, JSON.stringify(song, null, 2) + '\n', 'utf8')
  console.log(`write ${slug}.json  ${song.title}`)
  written++
}
console.log(`\n${written} song(s) written to src/data/songs/`)
