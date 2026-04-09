'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question_text: string;
  order_index: number;
  options: { id: string; option_text: string; order_index: number }[];
}

interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  questions: Question[];
}

interface Result {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
}

export default function QuizPage() {
  const { courseSlug, lessonId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    api.get(`/quizzes/${lessonId}`)
      .then((r) => setQuiz(r.data))
      .catch(() => toast.error('Quiz introuvable'))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleSubmit = async () => {
    if (Object.keys(answers).length < (quiz?.questions.length ?? 0)) {
      toast.error('Répondez à toutes les questions');
      return;
    }
    setSubmitting(true);
    try {
      const r = await api.post(`/quizzes/${lessonId}/attempt`, { answers });
      setResult(r.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>;
  if (!quiz) return <div className="text-center py-20 text-gray-500">Quiz introuvable</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour à la leçon
      </button>

      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-500 text-sm">{quiz.questions.length} questions · Score minimum: {quiz.passing_score}%</p>
      </div>

      {result ? (
        <div className="card p-8 text-center">
          {result.passed ? (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Félicitations !' : 'Pas cette fois'}</h2>
          <p className="text-gray-600 mb-4">
            Votre score: <span className="font-bold">{result.score}%</span> ({result.correct}/{result.total} bonnes réponses)
          </p>
          {!result.passed && (
            <button onClick={handleRetry} className="btn-primary">
              Réessayer
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">
                <span className="text-primary-600 mr-2">{idx + 1}.</span>{q.question_text}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[q.id] === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt.id}
                      checked={answers[q.id] === opt.id}
                      onChange={() => setAnswers({ ...answers, [q.id]: opt.id })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">{opt.option_text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Soumission...' : 'Soumettre mes réponses'}
          </button>
        </div>
      )}
    </div>
  );
}