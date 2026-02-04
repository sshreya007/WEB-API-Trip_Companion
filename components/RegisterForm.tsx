// "use client";

// export default function RegisterForm() {
//   return (
//     <form>
//       <div className="row">
//         <input placeholder="First Name" />
//         <input placeholder="Last Name" />
//       </div>

//       <input placeholder="Email" />
//       <input type="password" placeholder="Enter your password" />

//       <label className="checkbox">
//         <input type="checkbox" /> I agree to the Terms & Conditions
//       </label>

//       <button type="submit">Create Account</button>
//     </form>
//   );
// }

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';
import { validateRegisterForm } from '@/lib/utils/validation';
import { RegisterFormData } from '@/types/auth.types';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate terms
    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    // Validate form
    const validationError = validateRegisterForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      const result = await authAPI.register(registerData);

      if (result.success) {
        // Redirect to login
        router.push('/auth/login?registered=true');
      } else {
        setError(result.error || 'Registration failed');
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

      <div className="row">
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />

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

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      <label className="checkbox">
        <input 
          type="checkbox" 
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        /> 
        I agree to the Terms & Conditions
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}