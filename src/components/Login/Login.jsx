// src/components/Login/Login.js
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import css from "./Login.module.scss";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUpOrSignIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signUpOrSignIn(email, password);
      navigate('/');
    } catch (error) {
      if (error.message === 'Account exists, but password is incorrect') {
        setError('Incorrect password for existing account. Please try again.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check and try again.');
      } else {
        setError('An error occurred. Please try again later.');
        console.error('Authentication error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to log in with Google. Please try again.');
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.loginContainer}>
      <div className={css.loginForm}>
        <h2>Welcome</h2>
        {error && <p className={css.error}>{error}</p>}
        <form onSubmit={handleEmailAuth}>
          <div className={css.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={css.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={css.loginButton} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Sign In / Sign Up'}
          </button>
        </form>
        <div className={css.divider}>
          <span>or</span>
        </div>
        <button onClick={handleGoogleLogin} className={css.googleButton} disabled={isLoading}>
          <FaGoogle /> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;