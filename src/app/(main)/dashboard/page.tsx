'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Award } from 'lucide-react';

interface DashboardStats {
  enrolled_courses: number;
  completed_courses: number;
  certificates: number;
  quizzes_passed: number;
  total_watched_seconds: number;
}

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  instructor_name?: string;
  category_name?: string;
  has_certificate?: boolean;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const token = Cookies.get('token');
    console.log('Token present:', !!token);
    
    api.get('/progress/dashboard')
      .then((dashRes) => {
        console.log('Dashboard response:', dashRes.data);
        const statsData = dashRes.data.stats || dashRes.data;
        setStats({
          enrolled_courses: Number(statsData.enrolled_courses) || 0,
          completed_courses: Number(statsData.completed_courses) || 0,
          certificates: Number(statsData.certificates) || 0,
          quizzes_passed: Number(statsData.quizzes_passed) || 0,
          total_watched_seconds: Number(statsData.total_watched_seconds) || 0,
        });
      })
      .catch(err => {
        console.error('Dashboard API error:', err.response || err);
      })
      .finally(() => setLoading(false));

    api.get('/progress/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Courses API error:', err));
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
      <h1 className="text-2xl font-bold mb-2">Bienvenue, {user?.name || user?.first_name || 'Apprenant'}</h1>
      <p className="text-gray-500 mb-8">Voici votre tableau de bord d&apos;apprentissage</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-500">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-700">{stats?.enrolled_courses ?? 0}</div>
            <div className="text-sm text-primary-600 font-medium">Cours suivis</div>
          </div>
        </div>
        
        <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-yellow-500">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-700">{stats?.certificates ?? 0}</div>
            <div className="text-sm text-yellow-600 font-medium">Certificats obtenus</div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <h2 className="text-xl font-semibold mb-4">Mes cours</h2>
      {courses.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
          Vous n'êtes inscrit à aucun cours.{' '}
          <Link href="/courses" className="text-primary-600 font-medium hover:underline">Explorer les cours</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      )}
    </div>
  );
}
