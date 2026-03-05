// "use client";

// export default function LoginForm() {
//   return (
//     <form>
//       <input type="email" placeholder="Email" />
//       <input type="password" placeholder="Enter your password" />

//       <button type="submit">Login</button>

//       <p className="tagline">Capturing Moments, Creating Memories</p>
//     </form>
//   );
// }

// // components/LoginForm.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';
import { validateLoginForm } from '@/lib/utils/validation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginFormData } from '@/types/auth.types';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    const validationError = validateLoginForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.login(formData);

      if (result.success && result.data) {
        // Store user data
        login(result.data.user, result.data.token);
        
        // ✅ ROLE-BASED REDIRECT
        if (result.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/auth/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {/*Forgot Password Link */}
      <div style={{ 
        textAlign: 'right', 
        marginTop: '8px' 
      }}>
        <Link 
          href="/auth/forgot-password"
          style={{ 
            fontSize: '14px', 
            color: '#0d9488', 
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#06b6d4'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#0ba9dd'}
        >
          Forgot Password?
        </Link>
      </div>

      

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="tagline">Capturing Moments, Creating Memories</p>
    </form>
  );
}

