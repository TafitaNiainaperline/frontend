'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, FileText, Plus, Trash2, Save } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  order_index: number;
  lessons: { id: string; title: string; duration_minutes: number; document_url: string }[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  category_id: string;
  duration_minutes: number;
  is_published: boolean;
  sections: Section[];
}

interface Category {
  id: string;
  name: string;
}

export default function EditCourse() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role === 'student') router.push('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) return;
    
    Promise.all([
      api.get(`/admin/courses/${id}`),
      api.get('/categories')
    ])
      .then(([courseRes, catRes]) => {
        setCourse(courseRes.data);
        setCategories(catRes.data);
      })
      .catch(err => {
        console.error(err);
        toast.error('Erreur lors du chargement');
      })
      .finally(() => setLoading(false));
  }, [user, id]);

  const handleAddSection = () => {
    if (!course) return;
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: `Section ${course.sections.length + 1}`,
      order_index: course.sections.length + 1,
      lessons: []
    };
    setCourse({ ...course, sections: [...course.sections, newSection] });
  };

  const handleAddLesson = (sectionIdx: number) => {
    if (!course) return;
    const sections = [...course.sections];
    sections[sectionIdx].lessons.push({
      id: crypto.randomUUID(),
      title: 'Nouvelle leçon',
      duration_minutes: 10,
      document_url: ''
    });
    setCourse({ ...course, sections });
  };

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    
    try {
      await api.patch(`/admin/courses/${id}`, course);
      toast.success('Cours enregistré');
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !course) {
    return <div className="p-6 lg:p-10">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Modifier le cours</h1>
          <p className="text-gray-500">Gérez le contenu du cours</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-5 h-5" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {course.sections.map((section, sectionIdx) => (
          <div key={section.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const sections = [...course.sections];
                  sections[sectionIdx].title = e.target.value;
                  setCourse({ ...course, sections });
                }}
                className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 outline-none px-2 py-1"
              />
              <button
                onClick={() => {
                  const sections = course.sections.filter((_, i) => i !== sectionIdx);
                  setCourse({ ...course, sections });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {section.lessons.map((lesson, lessonIdx) => (
                <div key={lesson.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => {
                      const sections = [...course.sections];
                      sections[sectionIdx].lessons[lessonIdx].title = e.target.value;
                      setCourse({ ...course, sections });
                    }}
                    className="flex-1 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 outline-none px-2 py-1"
                  />
                  <input
                    type="number"
                    value={lesson.duration_minutes}
                    onChange={(e) => {
                      const sections = [...course.sections];
                      sections[sectionIdx].lessons[lessonIdx].duration_minutes = parseInt(e.target.value);
                      setCourse({ ...course, sections });
                    }}
                    className="w-20 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 outline-none px-2 py-1"
                  />
                  <span className="text-sm text-gray-500">min</span>
                  <button
                    onClick={() => {
                      const sections = [...course.sections];
                      sections[sectionIdx].lessons = sections[sectionIdx].lessons.filter((_, i) => i !== lessonIdx);
                      setCourse({ ...course, sections });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => handleAddLesson(sectionIdx)}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4" />
                Ajouter une leçon
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddSection}
          className="w-full card p-6 flex items-center justify-center gap-2 text-gray-500 hover:text-primary-600 hover:border-primary-200"
        >
          <Plus className="w-5 h-5" />
          Ajouter une section
        </button>
      </div>
    </div>
  );
}
