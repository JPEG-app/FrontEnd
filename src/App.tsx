import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import { useAuthContext } from './contexts/AuthContext'; 

function App() {
  const { isAuthenticated } = useAuthContext();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/*" element={
            !isAuthenticated ? <Navigate to="/login" replace /> : (
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/:userHandle" element={<ProfilePage />} />
                        <Route path="*" element={<div className="p-4 text-center text-red-500">Page Not Found (Inside App)</div>} />
                    </Routes>
                </MainLayout>
            )
        }/>
      </Routes>
    </Router>
  );
}

export default App;