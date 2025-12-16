import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LatestStories from './pages/LatestStories';
import ArticleDetail from './pages/ArticleDetail';
import Analysis from './pages/Analysis';
import Voices from './pages/Voices';
import Foundations from './pages/Foundations';
import Bookshelf from './pages/Bookshelf';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/latest" element={<LatestStories />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/voices" element={<Voices />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;