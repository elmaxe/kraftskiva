export type Song = {
  /** Slug derived from the JSON filename, e.g. helan-gar.json -> "helan-gar" */
  id: string
  title: string
  /** Melody hint, e.g. "Mel: Blinka lilla stjärna" */
  melody?: string
  /** Free-form grouping, e.g. "Snapsvisa" */
  category?: string
  author?: string
  /** Verses separated by blank lines, rendered with white-space: pre-wrap */
  lyrics: string
}

type SongFile = Omit<Song, 'id'>

// One JSON file per song — dropping a new file into src/data/songs/ is enough,
// no registry to update.
const modules = import.meta.glob<SongFile>('./songs/*.json', {
  eager: true,
  import: 'default',
})

function slugFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.json$/, '')
}

export const songs: Song[] = Object.entries(modules)
  .map(([path, song]) => ({ ...song, id: slugFromPath(path) }))
  .sort((a, b) => a.title.localeCompare(b.title, 'sv'))

export const categories: string[] = [
  ...new Set(songs.map((song) => song.category).filter((c): c is string => !!c)),
].sort((a, b) => a.localeCompare(b, 'sv'))

export function getSong(id: string | undefined): Song | undefined {
  return songs.find((song) => song.id === id)
}
