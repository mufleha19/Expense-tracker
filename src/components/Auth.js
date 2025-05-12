import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, set } from 'firebase/database';

export default function Auth({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Initialize data structure for new email/password users
        await initializeUserData(userCredential.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const initializeUserData = async (user) => {
    try {
      await set(ref(db, `users/${user.uid}/income`), 0);
      await set(ref(db, `users/${user.uid}/expenses`), {});
      console.log('User data initialized for:', user.uid);
    } catch (err) {
      console.error('Error initializing user data:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Initialize user data structure if new user
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        await initializeUserData(result.user);
        alert('Welcome! Your account has been created and is ready to use.');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      
      <div className="auth-divider">OR</div>
      
      <button 
        onClick={handleGoogleSignIn}
        className="google-signin-btn"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
          alt="Google logo" 
          className="google-logo"
        />
        Sign in with Google
      </button>
      
      <button 
        onClick={() => setIsLogin(!isLogin)} 
        className="auth-toggle"
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
    </div>
  );
}