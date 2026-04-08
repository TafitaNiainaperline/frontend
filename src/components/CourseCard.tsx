import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, BarChart } from 'lucide-react';
import clsx from 'clsx';

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  enrollment_count?: number;
  instructor_name?: string;
  category_name?: string;
  progress_percent?: number;
}

const levelLabel: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

const levelColor: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function CourseCard({
  title, slug, description, thumbnail_url, level,
  duration_minutes, enrollment_count, instructor_name, category_name, progress_percent,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${slug}`} className="card hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-44 bg-gray-200 rounded-t-xl overflow-hidden">
        {thumbnail_url ? (
          <Image src={thumbnail_url} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
            <span className="text-white text-4xl font-bold">{title[0]}</span>
          </div>
        )}
        <span className={clsx('badge absolute top-2 left-2', levelColor[level])}>
          {levelLabel[level]}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {category_name && (
          <span className="text-xs text-primary-500 font-medium mb-1">{category_name}</span>
        )}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{title}</h3>
        {instructor_name && (
          <p className="text-xs text-gray-500 mb-2">{instructor_name}</p>
        )}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">{description}</p>
        )}

        {progress_percent !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progression</span>
              <span>{progress_percent}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress_percent}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {Math.floor(duration_minutes / 60)}h{duration_minutes % 60 ? `${duration_minutes % 60}m` : ''}
          </span>
          {enrollment_count !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {enrollment_count}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
