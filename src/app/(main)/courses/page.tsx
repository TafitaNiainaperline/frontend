'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  enrollment_count: number;
  instructor_name: string;
  category_name: string;
  has_certificate?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  course_count: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses', { params: { search, level, category } });
      setCourses(res.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchCourses, 300);
    return () => clearTimeout(delay);
  }, [search, level, category]);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
    fetchCourses();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-6">Tous les cours</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            className="input pl-9"
            placeholder="Rechercher un cours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input md:w-48" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Tous les niveaux</option>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>
        <select className="input md:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name} ({c.course_count})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Aucun cours trouvé pour ces critères.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.filter(c => !c.has_certificate).map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      )}
    </div>
  );
}
