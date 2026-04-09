'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Le mot de passe doit faire au moins 8 caractères'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 space-y-5">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Créer un compte</h1>
              <p className="text-gray-600 font-medium text-sm">Rejoignez notre plateforme d&apos;apprentissage</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Nom complet</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  className="input pl-12 pr-4 py-4 text-base" 
                  placeholder="Votre nom"
                  value={form.name} 
                  onChange={set('name')} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  className="input pl-12 pr-4 py-4 text-base" 
                  placeholder="exemple@email.com"
                  value={form.email} 
                  onChange={set('email')} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="input pl-12 pr-12 py-4 text-base" 
                  placeholder="Min. 8 caractères"
                  value={form.password} 
                  onChange={set('password')} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  className="input pl-12 pr-12 py-4 text-base" 
                  placeholder="Confirmez votre mot de passe"
                  value={form.confirmPassword} 
                  onChange={set('confirmPassword')} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Création en cours...
                </span>
              ) : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-gray-600 font-medium mt-8">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
