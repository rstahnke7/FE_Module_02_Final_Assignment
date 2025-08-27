import React from 'react';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { auth } from '../../lib/firebase';
import type { RootState } from '../../store';

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <span>Welcome, {user.email}</span>
        <button onClick={handleSignOut} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;