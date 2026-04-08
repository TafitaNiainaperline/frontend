export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <main className="flex-1">{children}</main>
      <footer className="bg-green-50 border-t border-green-200 text-center py-8 text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-gray-900 font-bold">IANAR</span><span className="text-primary-500 font-bold">AKO</span> — Tous droits réservés
      </footer>
    </div>
  );
}
