'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { CheckCircle, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface LessonDetail {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  course_id: string;
  progress?: { is_completed: boolean; watched_seconds: number };
  quiz_id?: string;
  next_lesson_id?: string;
  prev_lesson_id?: string;
}

export default function LearnPage() {
  const { courseSlug, lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const watchedRef = useRef(0);

  useEffect(() => {
    api.get(`/lessons/${lessonId}`)
      .then((r) => {
        setLesson(r.data);
        setCompleted(r.data.progress?.is_completed ?? false);
      })
      .catch(() => toast.error('Impossible de charger la leçon'));
  }, [lessonId]);

  const saveProgress = async (seconds: number, isCompleted: boolean) => {
    try {
      await api.post(`/lessons/${lessonId}/progress`, {
        watched_seconds: Math.floor(seconds),
        is_completed: isCompleted,
      });
    } catch {}
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    watchedRef.current = playedSeconds;
  };

  const handleEnded = async () => {
    setSaving(true);
    await saveProgress(watchedRef.current, true);
    setCompleted(true);
    setSaving(false);
    toast.success('Leçon terminée !');
  };

  const markComplete = async () => {
    setSaving(true);
    await saveProgress(watchedRef.current, true);
    setCompleted(true);
    setSaving(false);
    toast.success('Leçon marquée comme terminée');
  };

  if (!lesson) return <div className="flex items-center justify-center h-screen text-gray-500 animate-pulse">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

      {lesson.video_url ? (
        <div className="rounded-xl overflow-hidden bg-black aspect-video mb-6">
          <ReactPlayer
            url={lesson.video_url}
            width="100%"
            height="100%"
            controls
            onProgress={handleProgress}
            onEnded={handleEnded}
          />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-6 text-gray-400">
          Vidéo non disponible
        </div>
      )}

      {lesson.description && (
        <p className="text-gray-600 mb-6">{lesson.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-8">
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
        ) : (
          <button onClick={async () => { try { const r = await api.post(`/certificates/generate/${lesson.course_id}`); toast.success('Certificat obtenu !'); router.push('/certificates'); } catch (e: any) { toast.error(e.response?.data?.message || 'Erreur'); } }} className="btn-primary">
            Obtenir le certificat
          </button>
        )}
      </div>
    </div>
  );
}
