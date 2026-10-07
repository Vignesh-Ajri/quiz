import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './components/shared/AuthProvider';
import { Navbar } from './components/shared/Navbar';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/QuizDetail';
import QuizEngine from './pages/QuizEngine';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/Profile';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/Categories';
import AdminQuizzes from './pages/admin/Quizzes';
import QuizForm from './pages/admin/QuizForm';
import QuestionsManager from './pages/admin/QuestionsManager';
import AdminUsers from './pages/admin/UsersList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/quizzes/:id" element={<QuizDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              {/* Auth required */}
              <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                <Route path="/quiz/:quizId/attempt/:attemptId" element={<QuizEngine />} />
                <Route path="/results/:attemptId" element={<Result />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin only */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/quizzes" element={<AdminQuizzes />} />
                <Route path="/admin/quizzes/create" element={<QuizForm />} />
                <Route path="/admin/quizzes/:id/edit" element={<QuizForm />} />
                <Route path="/admin/quizzes/:id/questions" element={<QuestionsManager />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </main>
        </div>
        <ToastContainer position="bottom-right" theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
