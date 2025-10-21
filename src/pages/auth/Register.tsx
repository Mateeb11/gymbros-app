import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { supabase } from '../../services/supabase';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmailValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
  };

  const getPasswordStrength = (pwd: string): string => {
    if (pwd.length === 0) return '';
    if (pwd.length < 8) return 'Weak';
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    if (hasUpper && hasNumber && hasSpecial) return 'Strong';
    if ((hasUpper && hasNumber) || (hasUpper && hasSpecial) || (hasNumber && hasSpecial))
      return 'Medium';
    return 'Weak';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          weight_unit_preference: 'kg',
        });

        if (profileError) throw profileError;

        setSuccessMessage(
          'Registration successful! Please check your email to verify your account.'
        );
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent rounded-md flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">GB</span>
          </div>
          <h1 className="text-xl font-bold text-secondary mb-2">Create Account</h1>
          <p className="text-sm text-gray-600">Join GYMBROS and start tracking</p>
        </div>

        {errorMessage && (
          <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-success bg-opacity-10 border border-success text-success px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="your.email@example.com"
            required
          />

          <div className="mb-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className={`h-2 rounded transition-all ${
                        passwordStrength === 'Strong'
                          ? 'bg-success w-full'
                          : passwordStrength === 'Medium'
                          ? 'bg-warning w-2/3'
                          : 'bg-error w-1/3'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold">{passwordStrength}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min 8 chars, 1 uppercase, 1 number, 1 special character
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
