import Navbar from '@/components/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-950 border-t border-white/5 text-center py-8 text-sm text-gray-600">
        © {new Date().getFullYear()} <span className="text-white font-bold">INAR</span><span className="text-primary-400 font-bold">AKO</span> — Tous droits réservés
      </footer>
    </div>
  );
}
