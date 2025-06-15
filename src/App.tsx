import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthContext } from './contexts/AuthContext'; 
import PostDetailPage from './pages/PostDetailPage';
import { MessagesPage } from './pages/MessagesPage';
import { NewChannelPage } from './pages/NewChannelPage';

function App() {
  const { isAuthenticated } = useAuthContext();
  
  return (
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} />

          <Route path="/*" element={
              isAuthenticated ? (
                  <MainLayout>
                      <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/messages" element={<MessagesPage />} />
                          <Route path="/messages/new" element={<NewChannelPage />} />
                          <Route path="/post/:postId" element={<PostDetailPage />} /> 
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
  );
}

export default App;