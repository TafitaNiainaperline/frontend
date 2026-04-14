'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { BookOpen, Users, Award, PlusCircle, FileText, CheckCircle } from 'lucide-react';

interface AdminStats {
  total_courses: number;
  total_students: number;
  total_certificates: number;
  total_lessons: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role === 'student') router.push('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) return;
    
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="p-6 lg:p-10 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold mb-2">Tableau de bord Admin</h1>
      <p className="text-gray-500 mb-8">Gérez vos cours, étudiants et certificats</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-500">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-700">{stats?.total_courses ?? 0}</div>
            <div className="text-sm text-primary-600 font-medium">Total cours</div>
          </div>
        </div>
        
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-700">{stats?.total_students ?? 0}</div>
            <div className="text-sm text-blue-600 font-medium">Total étudiants</div>
          </div>
        </div>
        
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-yellow-500">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-700">{stats?.total_certificates ?? 0}</div>
            <div className="text-sm text-yellow-600 font-medium">Total certificats</div>
          </div>
        </div>
        
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">{stats?.total_lessons ?? 0}</div>
            <div className="text-sm text-green-600 font-medium">Total leçons</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/courses/new" className="card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <div className="font-semibold">Créer un cours</div>
            <div className="text-sm text-gray-500">Ajouter un nouveau cours</div>
          </div>
        </Link>
        
        <Link href="/admin/students" className="card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold">Gérer les étudiants</div>
            <div className="text-sm text-gray-500">Voir et gérer les inscriptions</div>
          </div>
        </Link>
        
        <Link href="/admin/certificates" className="card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <div className="font-semibold">Gérer les certificats</div>
            <div className="text-sm text-gray-500">Délivrer des certificats</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
