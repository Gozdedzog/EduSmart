'use client';

import { useState, useEffect, useRef } from 'react';

interface NotesPadProps {
  courseId: string;
}

export function NotesPad({ courseId }: NotesPadProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${courseId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [courseId]);

  // Auto-save notes to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (notes !== '') {
      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(`notes-${courseId}`, notes);
        setLastSaved(new Date());
        setIsSaving(false);
      }, 1000); // Auto-save after 1 second of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes, courseId]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const formatLastSaved = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notlarım</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {isSaving && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Kaydediliyor...</span>
            </div>
          )}
          {lastSaved && !isSaving && (
            <span>Son kayıt: {formatLastSaved(lastSaved)}</span>
          )}
        </div>
      </div>
      
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Bu ders hakkında notlarınızı buraya yazabilirsiniz..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      
      <div className="mt-2 text-xs text-gray-500">
        Notlarınız otomatik olarak kaydedilir
      </div>
    </div>
  );
}
