import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthContext } from './contexts/AuthContext'; 
import { LikesProvider } from './contexts/LikesContext';
import { TweetsProvider } from './contexts/TweetsContext';

function App() {
  const { isAuthenticated } = useAuthContext();
  
  return (
    <LikesProvider>
      <TweetsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} />

          <Route path="/*" element={
              isAuthenticated ? (
                  <MainLayout>
                      <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/explore" element={<ExplorePage />} />
                          <Route path="/notifications" element={<NotificationsPage />} />
                          {/* The profile page route should be specific to avoid conflicts */}
                          <Route path="/profile/:userHandle" element={<ProfilePage />} /> 
                          <Route path="*" element={<div className="p-4 text-center text-red-500">Page Not Found</div>} />
                      </Routes>
                  </MainLayout>
              ) : (
                  <Navigate to="/login" replace />
              )
          }/>
        </Routes>
      </Router>
      </TweetsProvider>
    </LikesProvider>
  );
}

export default App;