'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Clock, BarChart, Users, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  duration_minutes: number;
  is_preview: boolean;
  order_index: number;
  has_quiz?: boolean;
  is_completed?: boolean;
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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${slug}`);
        const courseData = courseRes.data;
        setCourse(courseData);
        
if (user && user.id) {
          const progressRes = await api.get(`/progress/courses/${courseData.id}`);
          const enrolledData = progressRes.data;
          if (enrolledData && enrolledData.length > 0) {
            setIsEnrolled(true);
          }
          
          const certRes = await api.get('/certificates');
          const allCerts = certRes.data;
          for (let i = 0; i < allCerts.length; i++) {
            if (String(allCerts[i].course_id) === String(courseData.id)) {
              setHasCertificate(true);
              break;
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, user, authLoading]);

  const handleEnroll = async () => {
    if (!user || !course) { router.push('/login'); return; }
    setEnrolling(true);
    try {
      await api.post(`/courses/${course.id}/enroll`);
      toast.success('Inscription réussie !');
      setIsEnrolled(true);
      router.push(`/learn/${course.slug}/${course.sections[0]?.lessons?.[0]?.id}`);
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="w-full aspect-video bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white text-5xl font-bold">{course.title[0]}</span>
            </div>
            
{hasCertificate ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <span className="text-green-700 font-medium block">Cours terminé</span>
                <Link href="/certificates" className="block mt-2 text-sm text-primary-600 hover:underline">
                  Voir le certificat
                </Link>
              </div>
            ) : isEnrolled && !hasCertificate ? (
              <Link href={`/learn/${course.slug}/${course.sections[0]?.lessons?.[0]?.id}`} className="btn-primary w-full py-3 text-center block">
                Lire le cours
              </Link>
            ) : (
              <button
                className="btn-primary w-full py-3 text-base"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Inscription...' : 'Commencer le cours'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
