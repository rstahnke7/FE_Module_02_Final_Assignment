import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../lib/firebase';
import { createUser } from '../../lib/firestore';
import { setError, setLoading } from '../../features/auth/authSlice';
import type { RootState } from '../../store';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(''));

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore
        await createUser(userCredential.user.uid, {
          email: email,
          name: name || email.split('@')[0], // Use email prefix if name not provided
        });
        // Clear form after successful signup
        setEmail('');
        setPassword('');
        setName('');
        // Note: setLoading(false) will be handled by AuthProvider when user state changes
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Clear form after successful login
        setEmail('');
        setPassword('');
        // Note: setLoading(false) will be handled by AuthProvider when user state changes
      }
    } catch (error: unknown) {
      dispatch(setError(error instanceof Error ? error.message : 'An unknown error occurred'));
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {isSignUp && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
        </button>
        
        <p className="auth-switch">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="link-button"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;