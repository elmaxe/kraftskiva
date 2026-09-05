import type { Song } from '../data/songs'

/** Lowercase and fold diacritics so "sma kraftor" matches "Små kräftor". */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function filterSongs(
  songs: Song[],
  query: string,
  category: string | null,
): Song[] {
  const needle = normalize(query.trim())

  return songs.filter((song) => {
    if (category && song.category !== category) return false
    if (!needle) return true

    const haystack = normalize(
      [song.title, song.lyrics, song.melody, song.language, song.author]
        .filter(Boolean)
        .join('\n'),
    )
    return haystack.includes(needle)
  })
}
