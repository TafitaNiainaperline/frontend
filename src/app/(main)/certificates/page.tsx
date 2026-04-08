'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Award, ExternalLink, Download } from 'lucide-react';

interface Certificate {
  id: string;
  certificate_number: string;
  issued_at: string;
  course_title: string;
  course_slug: string;
  category_name: string;
  student_name: string;
}

export default function CertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.get('/certificates')
      .then((r) => setCerts(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) return <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse"><div className="h-40 bg-gray-100 rounded-xl" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award className="w-7 h-7 text-yellow-500" /> Mes certificats
      </h1>

      {certs.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">Aucun certificat pour l'instant</p>
          <p className="text-sm">Terminez un cours pour obtenir votre certificat.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map((cert) => (
            <div key={cert.id} className="card p-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{cert.course_title}</h3>
                <p className="text-sm text-gray-500">{cert.category_name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  N° {cert.certificate_number} · Délivré le {new Date(cert.issued_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/certificates/verify/${cert.certificate_number}`}
                  target="_blank"
                  className="btn-secondary text-sm flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> Vérifier
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
