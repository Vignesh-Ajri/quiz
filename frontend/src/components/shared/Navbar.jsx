import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BookOpen, LogOut } from 'lucide-react';
import { logout } from '../../store/authSlice';
import api from '../../lib/axios';

export function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo + nav links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Questly</span>
          </Link>
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/quizzes" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Browse Quizzes
            </Link>
            <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Leaderboard
            </Link>
          </div>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary hidden md:flex items-center gap-2 mr-2">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{user.name.charAt(0)}</span>
                  )}
                </div>
                {user.name}
              </Link>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
