import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import FacultyRegister from './pages/FacultyRegister';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Jobs from './pages/Jobs';
import Resources from './pages/Resources';
import StudentProfile from './pages/StudentProfile';
import FacultyProfile from './pages/FacultyProfile';
import StudentList from './pages/StudentList';
import StudentProfileView from './pages/StudentProfileView';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/faculty/register" element={<FacultyRegister />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['student', 'faculty']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/student"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/faculty"
            element={
              <ProtectedRoute roles={['faculty']}>
                <FacultyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute roles={['faculty', 'admin']}>
                <StudentList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/student/:id"
            element={
              <ProtectedRoute roles={['faculty', 'admin']}>
                <StudentProfileView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
