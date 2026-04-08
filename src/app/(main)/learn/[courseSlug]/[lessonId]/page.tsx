'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export default function LearnPage() {
  const { courseSlug, lessonId } = useParams();
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

      <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
}
