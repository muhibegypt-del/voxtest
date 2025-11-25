import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LatestStories from './pages/LatestStories';
import ArticleDetail from './pages/ArticleDetail';
import EnhancedAdminDashboard from './pages/EnhancedAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/latest" element={<LatestStories />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <EnhancedAdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
