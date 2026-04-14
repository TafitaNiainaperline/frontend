'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Search, Mail, Award, BookOpen } from 'lucide-react';

interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at: string;
  enrolled_courses: number;
  completed_courses: number;
}

export default function AdminStudents() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role === 'student') router.push('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) return;
    
    api.get('/admin/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredStudents = students.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return <div className="p-6 lg:p-10">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Gestion des étudiants</h1>
        <p className="text-gray-500">Gérez les inscriptions et la progression des étudiants</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Étudiant</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Inscrit le</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Cours</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Complétés</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                      {student.first_name?.[0] || student.email[0].toUpperCase()}
                    </div>
                    <div className="font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(student.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    {student.enrolled_courses}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    <Award className="w-4 h-4" />
                    {student.completed_courses}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStudents.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Aucun étudiant trouvé
          </div>
        )}
      </div>
    </div>
  );
}
