'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration_minutes: number;
  category_name: string;
  is_published: boolean;
  instructor_name: string;
}

export default function AdminCourses() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role === 'student') router.push('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) return;
    
    api.get('/admin/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
    
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success('Cours supprimé');
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await api.patch(`/admin/courses/${course.id}`, { is_published: !course.is_published });
      toast.success(course.is_published ? 'Cours Masqué' : 'Cours Publié');
      setCourses(courses.map(c => c.id === course.id ? { ...c, is_published: !c.is_published } : c));
    } catch (err) {
      toast.error('Erreur');
    }
  };

  if (authLoading || loading) {
    return <div className="p-6 lg:p-10">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gestion des cours</h1>
          <p className="text-gray-500">Gérez vos cours et leur contenu</p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Créer un cours
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Titre</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Catégorie</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Niveau</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Durée</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500">{course.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.category_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{course.level}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{Math.floor(course.duration_minutes/60)}h{course.duration_minutes%60}m</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(course)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.is_published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {course.is_published ? 'Publié' : 'Brouillon'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/courses/${course.slug}`} className="p-2 text-gray-400 hover:text-primary-600">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/courses/${course.id}`} className="p-2 text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(course.id)} className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {courses.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Aucun cours. Créez votre premier cours !
          </div>
        )}
      </div>
    </div>
  );
}
