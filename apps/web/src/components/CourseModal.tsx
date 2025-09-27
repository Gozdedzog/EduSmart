'use client';

import { useState, useEffect } from 'react';
import { Course, COURSE_TYPES, COURSE_CATEGORIES } from '@/lib/courseDatabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Markdown editörünü dinamik olarak yükle (SSR sorunlarını önlemek için)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>) => void;
  editingCourse?: Course | null;
}

export function CourseModal({ isOpen, onClose, onSave, editingCourse }: CourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'VIDEO' as 'VIDEO' | 'ARTICLE',
    category: '',
    content: '',
    duration: 0,
    isPublished: false,
  });



  useEffect(() => {
    if (isOpen) {
      if (editingCourse) {
        setFormData({
          title: editingCourse.title,
          description: editingCourse.description,
          type: editingCourse.type,
          category: editingCourse.category,
          content: editingCourse.content,
          duration: editingCourse.duration || 0,
          isPublished: editingCourse.isPublished,
        });
      } else {
        // Yeni eğitim ekleme - form verilerini temizle
        setFormData({
          title: '',
          description: '',
          type: 'VIDEO',
          category: '',
          content: '',
          duration: 0,
          isPublished: false,
        });
      }
    }
  }, [isOpen, editingCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log('CourseModal: handleSubmit called!');
    e.preventDefault();
    console.log('CourseModal: Form submitted with data:', formData);
    console.log('CourseModal: Calling onSave...');
    onSave(formData);
    console.log('CourseModal: Calling onClose...');
    onClose();
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {editingCourse ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}
          </CardTitle>
          <CardDescription>
            Eğitim bilgilerini doldurun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tür *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COURSE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kategori seçin</option>
                  {COURSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Süre (dakika)
              </label>
              <input
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik *
              </label>
              <div className="space-y-2">
                {formData.type === 'VIDEO' ? (
                  <input
                    type="url"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Video URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="border border-gray-300 rounded-md">
                    <MDEditor
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                      data-color-mode="light"
                      height={300}
                      preview="edit"
                      hideToolbar={false}
                    />
                  </div>
                )}
                {formData.type === 'ARTICLE' && (
                  <div className="text-xs text-gray-500">
                    Yazılı içerik için WYSIWYG editörü kullanın. Metin formatlama, resim ekleme ve daha fazlası için araç çubuğunu kullanın.
                  </div>
                )}
              </div>
            </div>


            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Yayınla
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit">
                {editingCourse ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
