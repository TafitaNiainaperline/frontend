'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Award, Search, Download, Eye } from 'lucide-react';

interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  user_name: string;
  user_email: string;
  certificate_number: string;
  issued_at: string;
}

export default function AdminCertificates() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role === 'student') router.push('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) return;
    
    api.get('/admin/certificates')
      .then(res => setCertificates(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredCerts = certificates.filter(c => 
    c.user_email.toLowerCase().includes(search.toLowerCase()) ||
    c.user_name.toLowerCase().includes(search.toLowerCase()) ||
    c.course_title.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return <div className="p-6 lg:p-10">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Gestion des certificats</h1>
        <p className="text-gray-500">Délivrez et visualisez les certificats</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un certificat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Certificat</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Étudiant</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cours</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCerts.map(cert => (
              <tr key={cert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">#{cert.certificate_number}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{cert.user_name}</div>
                  <div className="text-xs text-gray-500">{cert.user_email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{cert.course_title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(cert.issued_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCerts.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Aucun certificat trouvé
          </div>
        )}
      </div>
    </div>
  );
}
