'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Le mot de passe doit faire au moins 8 caractères'); return; }
    setLoading(true);
    try {
      await register(form);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-xl">
            <BookOpen className="w-7 h-7" /> LearnPlatform
          </Link>
          <h1 className="text-2xl font-bold mt-4">Créer un compte</h1>
          <p className="text-gray-500 text-sm">Rejoignez des milliers d'apprenants</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Prénom</label>
              <input className="input" value={form.first_name} onChange={set('first_name')} required placeholder="Jean" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nom</label>
              <input className="input" value={form.last_name} onChange={set('last_name')} required placeholder="Dupont" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input type="email" className="input" value={form.email} onChange={set('email')} required placeholder="vous@exemple.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mot de passe</label>
            <input type="password" className="input" value={form.password} onChange={set('password')} required placeholder="Min. 8 caractères" />
          </div>
          <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
