export interface Course {
  id: string;
  title: string;
  type: 'VIDEO' | 'ARTICLE';
  tags: string[];
  progress: number; // 0-100
  bodyOrUrl: string;
}

export type Kind = 'Yazılı İçerik' | 'Video İçerik' | 'Sesli İçerik';

export interface Content {
  id: string;
  title: string;
  kind: Kind;
  minutes: number;
  tags: string[];
  color: string;
  contentData: { // İçeriğin tipine göre farklı yapılar içerecek
    type: 'video' | 'text';
    value: string; // Video URL'si veya metin içeriği
    questions?: string[]; // İsteğe bağlı sorular
  };
}

export const mockContents: Content[] = [
  {
    id: 'm1-video',
    title: 'Matematik - Trigonometriye Giriş',
    kind: 'Video İçerik',
    minutes: 15,
    tags: ['Matematik', 'Trigonometri'],
    color: 'bg-blue-50',
    contentData: {
      type: 'video',
      value: 'https://www.youtube.com/embed/McV7VSXzUDs', // YouTube video URL'si
      questions: ['Video içeriği ile ilgili ilk soru?', 'Video içeriği ile ilgili ikinci soru?'],
    },
  },
  {
    id: 'm1-text',
    title: 'Matematik - Trigonometriye Giriş',
    kind: 'Yazılı İçerik',
    minutes: 10,
    tags: ['Matematik', 'Trigonometri'],
    color: 'bg-blue-50',
    contentData: {
      type: 'text',
      value: 'Trigonometri, üçgenlerin açıları ve kenarları arasındaki ilişkileri inceleyen bir matematik dalıdır...', // Örnek metin içeriği
      questions: ['Yazılı içerik ile ilgili ilk soru?', 'Yazılı içerik ile ilgili ikinci soru?'],
    },
  },
  {
    id: 't1',
    title: 'Türkçe - Noktalama İşaretleri',
    kind: 'Video İçerik',
    minutes: 15,
    tags: ['Türkçe', 'Noktalama İşaretleri'],
    color: 'bg-green-50',
    contentData: {
      type: 'video',
      value: 'https://www.youtube.com/embed/DedyiW2jRZs',
      questions: ['Noktalama işaretleri ile ilgili ilk soru?', 'Noktalama işaretleri ile ilgili ikinci soru?'],
    },
  },
];

export const mockStats = {
  total: 12,
  completed: 8,
  avgScore: 85,
  totalMinutes: 180,
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    type: 'VIDEO',
    tags: ['React', 'JavaScript', 'Frontend'],
    progress: 75,
    bodyOrUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    type: 'ARTICLE',
    tags: ['TypeScript', 'Programming', 'Best Practices'],
    progress: 45,
    bodyOrUrl: `# TypeScript Best Practices

TypeScript is a powerful programming language that builds on JavaScript by adding static type definitions. Here are some best practices to follow:

## 1. Use Strict Mode
Always enable strict mode in your TypeScript configuration:
\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## 2. Define Clear Interfaces
Create well-defined interfaces for your data structures:
\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
\`\`\`

## 3. Use Type Guards
Implement type guards to ensure type safety at runtime:
\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
\`\`\`

## 4. Prefer Union Types Over Any
Instead of using \`any\`, use union types or unknown:
\`\`\`typescript
// Bad
function processData(data: any) { }

// Good
function processData(data: string | number) { }
\`\`\`

These practices will help you write more maintainable and type-safe TypeScript code.`,
  },
  {
    id: '3',
    title: 'Next.js App Router Deep Dive',
    type: 'VIDEO',
    tags: ['Next.js', 'React', 'Full Stack'],
    progress: 20,
    bodyOrUrl: 'https://www.youtube.com/embed/example-nextjs',
  },
  {
    id: '4',
    title: 'CSS Grid Layout Mastery',
    type: 'ARTICLE',
    tags: ['CSS', 'Layout', 'Frontend'],
    progress: 90,
    bodyOrUrl: `# CSS Grid Layout Mastery

CSS Grid is a powerful two-dimensional layout system that makes it easy to create complex layouts.

## Basic Grid Setup
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Grid Areas
You can name grid areas for easier layout management:
\`\`\`css
.grid-container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grids
Make your grids responsive with media queries:
\`\`\`css
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
\`\`\`

CSS Grid provides powerful tools for creating modern, responsive layouts.`,
  },
  {
    id: '5',
    title: 'Node.js Performance Optimization',
    type: 'VIDEO',
    tags: ['Node.js', 'Performance', 'Backend'],
    progress: 60,
    bodyOrUrl: 'https://www.youtube.com/embed/example-nodejs',
  },
  {
    id: '6',
    title: 'Database Design Principles',
    type: 'ARTICLE',
    tags: ['Database', 'SQL', 'Backend'],
    progress: 30,
    bodyOrUrl: `# Database Design Principles

Good database design is crucial for application performance and maintainability.

## 1. Normalization
Organize data to reduce redundancy:
- First Normal Form (1NF): Eliminate duplicate columns
- Second Normal Form (2NF): Remove partial dependencies
- Third Normal Form (3NF): Remove transitive dependencies

## 2. Primary Keys
Every table should have a primary key:
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## 3. Indexing Strategy
Create indexes on frequently queried columns:
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at);
\`\`\`

## 4. Relationships
Design clear relationships between tables:
- One-to-One: User → Profile
- One-to-Many: User → Posts
- Many-to-Many: Users ↔ Roles

Proper database design ensures data integrity and optimal performance.`,
  },
];
