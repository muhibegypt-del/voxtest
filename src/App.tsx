import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LatestStories from './pages/LatestStories';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/latest" element={<LatestStories />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;