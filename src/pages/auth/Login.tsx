import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { supabase } from '../../services/supabase';
import { setUser, setError } from '../../store/slices/authSlice';

const Login: React.FC = () => {
  const [email, setEmailValue] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          dispatch(setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            profile_picture_url: profile.profile_picture_url,
            weight_unit_preference: profile.weight_unit_preference,
          }));
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to login');
      dispatch(setError(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent rounded-md flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">GB</span>
          </div>
          <h1 className="text-xl font-bold text-secondary mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-600">Log in to track your fitness journey</p>
        </div>

        {errorMessage && (
          <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="your.email@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-accent hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
