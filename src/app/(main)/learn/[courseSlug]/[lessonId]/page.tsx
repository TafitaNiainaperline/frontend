'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, ChevronLeft, ChevronRight, HelpCircle, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonDetail {
  id: string;
  title: string;
  description: string;
  document_url?: string;
  duration_minutes: number;
  course_id: string;
  progress?: { is_completed: boolean; watched_seconds: number };
  quiz_id?: string;
  next_lesson_id?: string;
  prev_lesson_id?: string;
  course_progress?: { total_lessons: number; completed_lessons: number };
}

export default function LearnPage() {
  const { courseSlug, lessonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!lessonId || lessonId === 'undefined') {
      setError('Lecon invalide');
      return;
    }
    
    api.get(`/lessons/${lessonId}`)
      .then((r) => {
        setLesson(r.data);
        setCompleted(r.data.progress?.is_completed ?? false);
        
        return r.data.course_id;
      })
      .then((courseId) => {
        if (!courseId) return;
        return api.get(`/progress/courses/${courseId}`);
      })
      .then((r) => {
        if (!r) return;
        const sections = r.data || [];
        const total = sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0);
        const completedCount = sections.reduce((acc: number, s: any) => acc + (s.lessons?.filter((l: any) => l.is_completed)?.length || 0), 0);
        setAllLessonsCompleted(total > 0 && completedCount >= total);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Lecon invalide';
        setError(msg);
      });
  }, [lessonId, router, courseSlug]);

  const saveProgress = async (isCompleted: boolean) => {
    try {
      await api.post(`/lessons/${lessonId}/progress`, {
        watched_seconds: 0,
        is_completed: isCompleted,
      });
    } catch {}
  };

  const markComplete = async () => {
    setSaving(true);
    await saveProgress(true);
    setCompleted(true);
    setSaving(false);
    toast.success('Leçon terminée !');
    router.push('/courses');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('pdf')) {
      toast.error('Seuls les fichiers PDF sont autorisés');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const res = await api.post(`/lessons/${lessonId}/document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Document uploadé avec succès');
      setLesson((prev) => prev ? { ...prev, document_url: res.data.document_url } : null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  if (error || !lessonId || lessonId === 'undefined' || !lesson) return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-center">
      <p className="text-red-500 mb-4">{error || 'Lecon invalide'}</p>
      <button onClick={() => router.push('/courses')} className="btn-primary">
        Retour aux cours
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

      {lesson.document_url ? (
        <div className="mb-6">
          <div className="rounded-xl border border-gray-200 overflow-hidden" style={{ height: '70vh' }}>
            <iframe
              src={lesson.document_url}
              className="w-full h-full"
              title={lesson.title}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl aspect-[4/3] flex items-center justify-center mb-6 text-gray-400 min-h-[500px]">
          Document non disponible
        </div>
      )}

      {isInstructor && (
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-outline flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Upload en cours...' : 'Uploader un PDF'}
          </button>
        </div>
      )}

      {lesson.description && (
        <p className="text-gray-600 mb-6">{lesson.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/courses')}
          className="btn-outline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux cours
        </button>
        
        {completed ? (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="w-5 h-5" /> Leçon complétée
          </div>
        ) : (
          <button
            onClick={markComplete}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {saving ? 'Sauvegarde...' : 'Marquer comme terminée'}
          </button>
        )}
        
        {lesson.quiz_id && (
          <Link href={`/learn/${courseSlug}/${lessonId}/quiz`} className="btn-outline flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Faire le quiz
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        {lesson.prev_lesson_id ? (
          <Link href={`/learn/${courseSlug}/${lesson.prev_lesson_id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" /> Leçon précédente
          </Link>
        ) : <div />}
        
        {lesson.next_lesson_id ? (
          <Link href={`/learn/${courseSlug}/${lesson.next_lesson_id}`} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            Leçon suivante <ChevronRight className="w-5 h-5" />
          </Link>
        ) : allLessonsCompleted ? (
          <button onClick={async () => { try { await api.post(`/certificates/generate/${lesson.course_id}`); toast.success('Certificat obtenu !'); router.push('/certificates'); } catch (e: any) { toast.error(e.response?.data?.message || 'Erreur'); } }} className="btn-primary">
            Obtenir le certificat
          </button>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle className="w-5 h-5" /> Complétez toutes les leçons pour obtenir le certificat
          </div>
        )}
      </div>
    </div>
  );
}
