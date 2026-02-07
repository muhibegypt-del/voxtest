import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import LatestStories from './pages/LatestStories';
import CategoryPage from './pages/CategoryPage';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About'; // Added import for About component
import { ContentProvider } from './context/ContentContext';

function App() {
  return (
    <ContentProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          {/* M2: Main content target for skip link */}
          <main id="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/latest" element={<LatestStories />} />

              {/* Dynamic Category Route */}
              <Route path="/:category" element={<CategoryPage />} />

              <Route path="/article/:slug" element={<ArticleDetail />} />
              <Route path="/about" element={<About />} /> {/* Added route for About page */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;