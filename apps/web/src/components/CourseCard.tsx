'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  title: string;
  tags: string[];
  progress: number; // 0-100
  onClick?: () => void;
}

export function CourseCard({
  title,
  tags,
  progress,
  onClick,
}: CourseCardProps) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <Card
        className="relative cursor-pointer border-none shadow-lg bg-card/50 backdrop-blur-sm card-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
        onClick={onClick}
        tabIndex={0}
        role="button"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold line-clamp-2 min-h-[56px] flex items-center group-hover:text-primary transition-colors duration-200">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="text-foreground font-semibold">{progress}%</span>
            </div>
            <ProgressBar progress={progress} />
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
