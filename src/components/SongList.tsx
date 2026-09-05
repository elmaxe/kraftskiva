import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories, songs } from '../data/songs'
import { pickRandom } from '../lib/random'
import { filterSongs } from '../lib/search'

export default function SongList() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const results = useMemo(
    () => filterSongs(songs, query, category),
    [query, category],
  )

  function slumpa() {
    const song = pickRandom(results.length > 0 ? results : songs)
    if (song) navigate(`/visa/${song.id}`)
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="header__title">Kräftskiva</h1>
        <p className="header__subtitle">Sånghäfte · {songs.length} visor</p>
      </header>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sök på titel eller text…"
          aria-label="Sök visa"
          autoComplete="off"
        />
        <button className="button button--primary" type="button" onClick={slumpa}>
          🎲 Slumpa visa
        </button>
      </div>

      {categories.length > 0 && (
        <div className="chips" role="group" aria-label="Filtrera på kategori">
          <button
            type="button"
            className={`chip${category === null ? ' chip--active' : ''}`}
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
          >
            Alla
          </button>
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className={`chip${category === name ? ' chip--active' : ''}`}
              aria-pressed={category === name}
              onClick={() => setCategory(category === name ? null : name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <p className="empty">Inga visor matchade sökningen.</p>
      ) : (
        <ul className="songlist">
          {results.map((song) => (
            <li key={song.id}>
              <Link className="songlist__item" to={`/visa/${song.id}`}>
                <span className="songlist__title">{song.title}</span>
                {song.category && (
                  <span className="songlist__meta">{song.category}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="footer">Skål! 🦞</footer>
    </div>
  )
}
