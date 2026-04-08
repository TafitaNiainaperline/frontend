'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-gray-950/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-white font-black text-xl tracking-tight">INAR</span>
            <span className="text-primary-400 font-black text-xl tracking-tight">AKO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/courses', label: 'Cours' },
              { href: '/about', label: 'À propos' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`text-sm font-medium transition-colors ${
                  isActive(href) ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  {user.first_name}
                </Link>
                <button onClick={logout} className="border border-white/10 text-gray-300 text-sm font-medium px-5 py-2 rounded-full hover:bg-white/5 transition-all">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                  Connexion
                </Link>
                <Link href="/register" className="bg-primary-500 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-400 transition-all">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white flex flex-col gap-1.5 p-1" onClick={() => setOpen(!open)}>
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-900 border-t border-white/5 px-6 py-4 space-y-3">
          {[
            { href: '/', label: 'Accueil' },
            { href: '/courses', label: 'Cours' },
            { href: '/about', label: 'À propos' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="block text-gray-400 hover:text-white text-sm py-1.5 font-medium" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="border-t border-white/5 pt-3 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-400 text-sm py-1.5" onClick={() => setOpen(false)}>Tableau de bord</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="block text-red-400 text-sm py-1.5">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-400 text-sm py-1.5 font-medium" onClick={() => setOpen(false)}>Connexion</Link>
                <Link href="/register" className="block text-primary-400 text-sm py-1.5 font-bold" onClick={() => setOpen(false)}>S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
