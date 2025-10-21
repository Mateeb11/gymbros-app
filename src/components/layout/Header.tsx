import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-secondary text-primary shadow-md">
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">GB</span>
            </div>
            <span className="ml-3 text-lg font-bold">GYMBROS</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-accent transition-colors">
                Dashboard
              </Link>
              <Link to="/exercises" className="hover:text-accent transition-colors">
                Exercises
              </Link>
              <Link to="/groups" className="hover:text-accent transition-colors">
                Groups
              </Link>
              <Link to="/profile" className="hover:text-accent transition-colors">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                Logout
              </button>
            </nav>
          )}

          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="hover:text-accent transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/exercises"
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Exercises
                </Link>
                <Link
                  to="/groups"
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Groups
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
