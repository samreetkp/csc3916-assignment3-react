import './App.css';
import MovieHeader from './components/movieheader';
import Movies from './components/movie';
import MovieDetail from './components/moviedetail';
import Authentication from './components/authentication';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <MovieHeader />
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/signin" element={<Authentication />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
