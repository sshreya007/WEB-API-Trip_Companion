'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api/admin';
import { CreateUserData, UpdateUserData } from '@/lib/api/admin';
import { User } from '@/types/auth.types';

interface UserFormProps {
  userId?: string;
  isEdit?: boolean;
}

export default function UserForm({ userId, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    gender: '',
    age: '',
    bio: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Fetch user data if editing
  useEffect(() => {
    if (isEdit && userId) {
      fetchUser();
    }
  }, [isEdit, userId]);

  const fetchUser = async () => {
    setFetchLoading(true);
    const result = await adminAPI.getUserById(userId!);
    
    if (result.success && result.data) {
      const user = result.data;
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: '', // Don't populate password
        role: user.role,
        gender: user.gender || '',
        age: user.age?.toString() || '',
        bio: user.bio || '',
      });
    } else {
      setError(result.error || 'Failed to load user');
    }
    setFetchLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };

      // Add optional fields
      if (formData.password) userData.password = formData.password;
      if (formData.gender) userData.gender = formData.gender;
      if (formData.age) userData.age = parseInt(formData.age);
      if (formData.bio) userData.bio = formData.bio;

      let result;
      if (isEdit && userId) {
        result = await adminAPI.updateUser(userId, userData, image || undefined);
      } else {
        if (!formData.password) {
          setError('Password is required for new users');
          setLoading(false);
          return;
        }
        result = await adminAPI.createUser(userData, image || undefined);
      }

      if (result.success) {
        alert(isEdit ? 'User updated successfully!' : 'User created successfully!');
        router.push('/admin/users');
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div style={{ padding: '20px' }}>Loading user data...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>

      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            First Name *
          </label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Last Name *
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Username *
        </label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Email *
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Password {!isEdit && '*'}
        </label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEdit}
          placeholder={isEdit ? 'Leave blank to keep current password' : ''}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Role *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Age
        </label>
        <input
          name="age"
          type="number"
          min="1"
          max="150"
          value={formData.age}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={500}
          rows={4}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin/users')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}