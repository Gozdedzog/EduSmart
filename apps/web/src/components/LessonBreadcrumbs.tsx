import Link from 'next/link';

interface LessonBreadcrumbsProps {
  courseTitle: string;
}

export function LessonBreadcrumbs({ courseTitle }: LessonBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <Link 
        href="/" 
        className="hover:text-gray-900 transition-colors"
      >
        Dashboard
      </Link>
      <span>/</span>
      <Link 
        href="/icerikler" 
        className="hover:text-gray-900 transition-colors"
      >
        İçerikler
      </Link>
      <span>/</span>
      <span className="text-gray-900 font-medium">{courseTitle}</span>
    </nav>
  );
}
