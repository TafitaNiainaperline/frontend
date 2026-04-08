'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Award, CheckCircle, XCircle } from 'lucide-react';

interface VerifyResult {
  valid: boolean;
  certificate_number?: string;
  issued_at?: string;
  course_title?: string;
  level?: string;
  student_name?: string;
}

export default function VerifyCertificatePage() {
  const { number } = useParams();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/certificates/verify/${number}`)
      .then((r) => setResult(r.data))
      .catch(() => setResult({ valid: false }))
      .finally(() => setLoading(false));
  }, [number]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh] animate-pulse text-gray-400">Vérification...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      {result?.valid ? (
        <div className="card p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-xl font-bold mb-1">Certificat valide</h1>
          <p className="text-gray-500 mb-6">Ce certificat est authentique</p>
          <div className="text-left space-y-3 bg-green-50 rounded-xl p-4">
            <div><span className="text-xs text-gray-400 block">Apprenant</span><span className="font-medium">{result.student_name}</span></div>
            <div><span className="text-xs text-gray-400 block">Cours</span><span className="font-medium">{result.course_title}</span></div>
            <div><span className="text-xs text-gray-400 block">Niveau</span><span className="font-medium capitalize">{result.level}</span></div>
            <div><span className="text-xs text-gray-400 block">Délivré le</span><span className="font-medium">{new Date(result.issued_at!).toLocaleDateString('fr-FR')}</span></div>
            <div><span className="text-xs text-gray-400 block">N° de certificat</span><span className="font-mono text-sm">{result.certificate_number}</span></div>
          </div>
        </div>
      ) : (
        <div className="card p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-xl font-bold mb-1">Certificat invalide</h1>
          <p className="text-gray-500">Ce numéro de certificat n'existe pas dans notre système.</p>
        </div>
      )}
    </div>
  );
}
