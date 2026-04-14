import Link from 'next/link';
import { Clock } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  instructor_name?: string;
  category_name?: string;
}

const levelLabel: Record<string, string> = {
  beginner: 'Debutant',
  intermediate: 'Intermediaire',
  advanced: 'Avance',
};

export default function CourseCard({
  title, slug, description, level,
  duration_minutes, instructor_name, category_name,
}: CourseCardProps) {
  
  return (
    <Link href={`/courses/${slug}`} className="card hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
        <span className="text-white text-5xl font-bold">{title[0]}</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {category_name && (
          <span className="text-xs text-primary-600 font-bold uppercase tracking-wide mb-2">{category_name}</span>
        )}
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 text-lg leading-tight">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>
        )}
        
        {instructor_name && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-xs font-bold">{instructor_name[0]}</span>
            </div>
            <span className="text-xs text-gray-500">{instructor_name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(duration_minutes / 60)}h{duration_minutes % 60 ? `${duration_minutes % 60}m` : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}