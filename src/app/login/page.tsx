'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/#courses', label: 'Cours' },
  { href: '/#about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <nav className="bg-green-50/90 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-gray-900 font-black text-xl tracking-tight">INAR</span>
              <span className="text-primary-500 font-black text-xl tracking-tight">AKO</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="text-base font-semibold px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-green-50 transition-all">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2">Connexion</Link>
              <Link href="/register" className="bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-500 transition-all">S'inscrire</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mt-4">Connexion</h1>
            <p className="text-gray-500 text-sm">Bon retour parmi nous !</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Mot de passe</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary-500 font-medium hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
