'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Test, Question, TEST_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/testDatabase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>) => void;
  editingTest?: Test | null;
}

export function TestModal({ isOpen, onClose, onSave, editingTest }: TestModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    relatedContentId: '',
    relatedContentTitle: '',
    duration: 15,
    difficulty: 'Kolay' as 'Kolay' | 'Orta' | 'Zor',
    isPublished: true,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Form verilerini sıfırla
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      relatedContentId: '',
      relatedContentTitle: '',
      duration: 15,
      difficulty: 'Kolay',
      isPublished: true,
    });
    setQuestions([]);
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  // Düzenleme modunda formu doldur
  useEffect(() => {
    if (editingTest) {
      setFormData({
        title: editingTest.title,
        description: editingTest.description,
        category: editingTest.category,
        relatedContentId: editingTest.relatedContentId,
        relatedContentTitle: editingTest.relatedContentTitle,
        duration: editingTest.duration,
        difficulty: editingTest.difficulty,
        isPublished: editingTest.isPublished,
      });
      setQuestions(editingTest.questions);
    } else {
      resetForm();
    }
  }, [editingTest, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: questions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
    });
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    const questionData = {
      ...editingQuestion,
      id: editingQuestion.id || questions.length + 1,
    };

    if (editingTest && editingTest.questions.find(q => q.id === questionData.id)) {
      // Güncelle
      setQuestions(prev => 
        prev.map(q => q.id === questionData.id ? questionData : q)
      );
    } else {
      // Yeni ekle
      setQuestions(prev => [...prev, questionData]);
    }

    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert('En az bir soru eklemelisiniz!');
      return;
    }

    const testData = {
      ...formData,
      questionCount: questions.length,
      questions,
    };

    onSave(testData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTest ? 'Test Düzenle' : 'Yeni Test Ekle'}
          </DialogTitle>
          <DialogDescription>
            Test bilgilerini girin ve soruları ekleyin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Test Başlığı</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Test başlığını girin"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {TEST_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="relatedContentId">İlgili İçerik ID</Label>
              <Input
                id="relatedContentId"
                value={formData.relatedContentId}
                onChange={(e) => handleInputChange('relatedContentId', e.target.value)}
                placeholder="İlgili eğitim içeriği ID'si"
              />
            </div>

            <div>
              <Label htmlFor="relatedContentTitle">İlgili İçerik Başlığı</Label>
              <Input
                id="relatedContentTitle"
                value={formData.relatedContentTitle}
                onChange={(e) => handleInputChange('relatedContentTitle', e.target.value)}
                placeholder="İlgili eğitim içeriği başlığı"
              />
            </div>

            <div>
              <Label htmlFor="duration">Süre (dakika)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 15)}
                min="1"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Zorluk Seviyesi</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleInputChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Test açıklamasını girin"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
            />
            <Label htmlFor="isPublished">Yayında</Label>
          </div>

          {/* Sorular Bölümü */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sorular ({questions.length})</h3>
              <Button type="button" onClick={handleAddQuestion} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Soru Ekle
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz soru eklenmemiş. "Soru Ekle" butonuna tıklayarak ilk sorunuzu ekleyin.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Soru {index + 1}</h4>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                    <div className="text-xs text-gray-500">
                      Doğru cevap: {question.options[question.correct]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              İptal
            </Button>
            <Button type="submit" disabled={questions.length === 0}>
              {editingTest ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>

        {/* Soru Ekleme/Düzenleme Modal */}
        {showQuestionForm && editingQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingTest && editingTest.questions.find(q => q.id === editingQuestion.id) 
                  ? 'Soruyu Düzenle' 
                  : 'Yeni Soru Ekle'
                }
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="questionText">Soru Metni</Label>
                  <Textarea
                    id="questionText"
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion(prev => 
                      prev ? { ...prev, question: e.target.value } : null
                    )}
                    placeholder="Soruyu girin"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Seçenekler</Label>
                  <div className="space-y-2">
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.options];
                            newOptions[index] = e.target.value;
                            setEditingQuestion(prev => 
                              prev ? { ...prev, options: newOptions } : null
                            );
                          }}
                          placeholder={`Seçenek ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correct"
                          checked={editingQuestion.correct === index}
                          onChange={() => setEditingQuestion(prev => 
                            prev ? { ...prev, correct: index } : null
                          )}
                        />
                        <Label className="text-sm">Doğru</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="explanation">Açıklama</Label>
                  <Textarea
                    id="explanation"
                    value={editingQuestion.explanation}
                    onChange={(e) => setEditingQuestion(prev => 
                      prev ? { ...prev, explanation: e.target.value } : null
                    )}
                    placeholder="Cevabın açıklamasını girin"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingQuestion(null);
                    setShowQuestionForm(false);
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveQuestion}
                  disabled={!editingQuestion.question || editingQuestion.options.some(opt => !opt.trim())}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
