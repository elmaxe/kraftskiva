import type { Song } from '../data/songs'

/** Pick a random song, avoiding excludeId unless it is the only one left. */
export function pickRandom(songs: Song[], excludeId?: string): Song | undefined {
  if (songs.length === 0) return undefined

  const pool = songs.filter((song) => song.id !== excludeId)
  const candidates = pool.length > 0 ? pool : songs

  return candidates[Math.floor(Math.random() * candidates.length)]
}
