import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { getUser, updateUser, deleteUser } from '../../lib/firestore';
import { deleteUser as deleteAuthUser } from 'firebase/auth';
import type { User } from '../../types';

const UserProfile: React.FC = () => {
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authUser) return;
      
      try {
        const userData = await getUser(authUser.uid);
        if (userData) {
          setUser(userData);
          setFormData({
            name: userData.name,
            address: userData.address || '',
            phone: userData.phone || '',
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!authUser) return;
    
    try {
      setError(null);
      await updateUser(authUser.uid, formData);
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          ...formData,
          updatedAt: new Date(),
        });
      }
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!authUser || !confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      await deleteUser(authUser.uid);
      await deleteAuthUser(authUser);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-error">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="profile-info">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} disabled />
          </div>
          
          <div className="form-group">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <input type="text" value={user.name} disabled />
            )}
          </div>
          
          <div className="form-group">
            <label>Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
              />
            ) : (
              <textarea value={user.address || 'Not provided'} disabled rows={3} />
            )}
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <input type="tel" value={user.phone || 'Not provided'} disabled />
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    address: user.address || '',
                    phone: user.phone || '',
                  });
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Profile
            </button>
          )}
          
          <button onClick={handleDeleteAccount} className="delete-button">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;