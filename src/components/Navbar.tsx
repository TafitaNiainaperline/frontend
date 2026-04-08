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
    <nav className="bg-green-50/90 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-gray-900 font-black text-xl tracking-tight">IANAR</span>
            <span className="text-primary-500 font-black text-xl tracking-tight">AKO</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/#courses', label: 'Cours' },
              { href: '/#about', label: 'À propos' },
              { href: '/#contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`text-base font-semibold px-3 py-2 rounded-lg transition-all ${
                  isActive(href) ? 'text-primary-600 bg-green-100' : 'text-gray-700 hover:text-primary-600 hover:bg-green-50'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                  {user.first_name}
                </Link>
                <button onClick={logout} className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition-all">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-4 py-2">
                  Connexion
                </Link>
                <Link href="/register" className="bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-500 transition-all">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-900 flex flex-col gap-1.5 p-1" onClick={() => setOpen(!open)}>
            <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-green-50 border-t border-green-200 px-6 py-4 space-y-3">
          {[
            { href: '/', label: 'Accueil' },
            { href: '/#courses', label: 'Cours' },
            { href: '/#about', label: 'À propos' },
            { href: '/#contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="block text-gray-600 hover:text-gray-900 text-sm py-1.5 font-medium" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-200 pt-3 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-600 text-sm py-1.5" onClick={() => setOpen(false)}>Tableau de bord</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="block text-red-500 text-sm py-1.5">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-600 text-sm py-1.5 font-medium" onClick={() => setOpen(false)}>Connexion</Link>
                <Link href="/register" className="block text-primary-500 text-sm py-1.5 font-bold" onClick={() => setOpen(false)}>S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
