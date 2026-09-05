import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSong, songs } from '../data/songs'
import { pickRandom } from '../lib/random'

export default function SongView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const song = getSong(id)

  if (!song) {
    return (
      <div className="page">
        <p className="empty">Visan finns inte.</p>
        <Link className="button" to="/">
          ← Till alla visor
        </Link>
      </div>
    )
  }

  function nasta() {
    const next = pickRandom(songs, song?.id)
    if (next) navigate(`/visa/${next.id}`)
  }

  const meta = [song.melody, song.language, song.author].filter(Boolean).join(' · ')

  return (
    <div className="page">
      <nav className="songnav">
        <Link className="button" to="/">
          ← Alla visor
        </Link>
        <button className="button" type="button" onClick={nasta}>
          🎲 Nästa visa
        </button>
      </nav>

      <article className="song">
        <h1 className="song__title">{song.title}</h1>
        {song.category && <p className="song__category">{song.category}</p>}
        {meta && <p className="song__meta">{meta}</p>}
        <p className="song__lyrics">{song.lyrics}</p>
      </article>
    </div>
  )
}
