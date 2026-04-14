'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, FileText } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function NewCourse() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    level: 'beginner',
    category_id: '',
    duration_minutes: 60,
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role === 'student') router.push('/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) return;
    
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [user]);

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('pdf')) {
        toast.error('Seuls les fichiers PDF sont autorisés');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un PDF');
      return;
    }
    
    setLoading(true);
    
    try {
      const courseRes = await api.post('/admin/courses', {
        ...form,
        description: selectedFile.name.replace('.pdf', '')
      });
      
      const courseId = courseRes.data.id;
      
      const lessonRes = await api.post('/admin/courses/' + courseId + '/lessons', {
        title: form.title,
        duration_minutes: form.duration_minutes,
        is_preview: true
      });
      
      if (lessonRes.data.id) {
        const pdfFormData = new FormData();
        pdfFormData.append('document', selectedFile);
        
        await api.post(`/lessons/${lessonRes.data.id}/document`, pdfFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      toast.success('Cours créé avec succès');
      router.push(`/admin/courses`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-6 lg:p-10">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Créer un nouveau cours</h1>
        <p className="text-gray-500 mb-8">Uploader un PDF pour créer le cours</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre du cours</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              placeholder="Ex: Introduction à Python"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Uploader le PDF du cours</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3 text-primary-600">
                  <FileText className="w-10 h-10" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Upload className="w-10 h-10 mx-auto mb-3" />
                  <p>Cliquez pour uploader un PDF</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              >
                <option value="">Sélectionner</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Création...' : 'Créer le cours'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              className="btn-outline"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
