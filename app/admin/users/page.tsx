'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import UserList from '@/components/admin/UserList';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <h1 style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        Admin Panel - User Management
      </h1>
      <UserList />
    </div>
  );
}