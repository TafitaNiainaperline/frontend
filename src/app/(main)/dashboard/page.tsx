'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Award, Clock, CheckCircle } from 'lucide-react';

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
  thumbnail_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  progress_percent: number;
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
    Promise.all([
      api.get('/progress/dashboard'),
      api.get('/progress/courses'),
    ]).then(([dashRes, coursesRes]) => {
      setStats(dashRes.data.stats);
      setCourses(coursesRes.data);
    }).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const watchedHours = stats ? Math.floor(stats.total_watched_seconds / 3600) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Bonjour, {user?.first_name} 👋</h1>
      <p className="text-gray-500 mb-8">Voici votre tableau de bord d'apprentissage</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Cours inscrits', value: stats?.enrolled_courses ?? 0, icon: BookOpen, color: 'text-primary-600 bg-primary-50' },
          { label: 'Cours complétés', value: stats?.completed_courses ?? 0, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Certificats', value: stats?.certificates ?? 0, icon: Award, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Heures apprises', value: `${watchedHours}h`, icon: Clock, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <h2 className="text-xl font-semibold mb-4">Mes cours</h2>
      {courses.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
          Vous n'êtes inscrit à aucun cours.{' '}
          <a href="/courses" className="text-primary-600 font-medium hover:underline">Explorer les cours</a>
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
