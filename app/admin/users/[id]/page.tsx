'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import UserForm from '@/components/admin/UserForm';

export default function EditUserPage({ params }: { params: { id: string } }) {
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
        Edit User
      </h1>
      <UserForm userId={params.id} isEdit={true} />
    </div>
  );
}