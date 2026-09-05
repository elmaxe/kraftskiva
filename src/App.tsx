import { Navigate, Route, Routes } from 'react-router-dom'
import SongList from './components/SongList'
import SongView from './components/SongView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SongList />} />
      <Route path="/visa/:id" element={<SongView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
