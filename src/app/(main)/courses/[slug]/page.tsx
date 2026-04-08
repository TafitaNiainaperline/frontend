'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Clock, BarChart, Users, ChevronDown, ChevronUp, Play, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Lesson {
  id: string;
  title: string;
  duration_minutes: number;
  is_preview: boolean;
  order_index: number;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url?: string;
  level: string;
  duration_minutes: number;
  instructor_name: string;
  instructor_avatar?: string;
  category_name: string;
  sections: Section[];
}

const levelLabel: Record<string, string> = {
  beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé',
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then((r) => {
        setCourse(r.data);
        if (r.data.sections?.length) setOpenSection(r.data.sections[0].id);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) { router.push('/login'); return; }
    setEnrolling(true);
    try {
      await api.post(`/courses/${course!.id}/enroll`);
      toast.success('Inscription réussie !');
      router.push('/dashboard');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>;
  if (!course) return <div className="text-center py-20 text-gray-500">Cours introuvable</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <span className="text-sm text-primary-600 font-medium">{course.category_name}</span>
          <h1 className="text-3xl font-bold mt-1 mb-3">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1"><BarChart className="w-4 h-4" /> {levelLabel[course.level]}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />
              {Math.floor(course.duration_minutes / 60)}h{course.duration_minutes % 60 ? `${course.duration_minutes % 60}m` : ''}
            </span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Par {course.instructor_name}</span>
          </div>

          {/* Curriculum */}
          <h2 className="text-xl font-semibold mb-3">Contenu du cours</h2>
          <div className="space-y-2">
            {course.sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 text-left"
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                >
                  <span className="font-medium text-sm">{section.title}</span>
                  {openSection === section.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === section.id && section.lessons && (
                  <ul className="divide-y divide-gray-100">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        {lesson.is_preview ? (
                          <Play className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={clsx('flex-1', !lesson.is_preview && 'text-gray-500')}>{lesson.title}</span>
                        <span className="text-gray-400">{lesson.duration_minutes}min</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            {course.thumbnail_url ? (
              <img src={course.thumbnail_url} alt={course.title} className="w-full rounded-lg mb-4 aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">{course.title[0]}</span>
              </div>
            )}
            <button
              className="btn-primary w-full py-3 text-base"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Inscription...' : 'S\'inscrire au cours'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">Accès à vie une fois inscrit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
