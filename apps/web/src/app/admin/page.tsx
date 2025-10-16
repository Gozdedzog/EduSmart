'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/HybridAuthProvider';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllUsers } from '@/lib/userDatabase';
import { getAllCourses, saveCoursesToFile } from '@/lib/fileCourseDatabase';
import { Course, addCourse, updateCourse, deleteCourse, COURSE_TYPES, COURSE_CATEGORIES, getDefaultCourses } from '@/lib/courseDatabase';
import { Test, getAllTests, addTest, updateTest, deleteTest, saveTestsToFile, refreshTests, reloadTests, TEST_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/testDatabase';
import { CourseModal } from '@/components/CourseModal';
import { TestModal } from '@/components/TestModal';
import { RatingStats } from '@/components/RatingStats';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

export default function AdminPage() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'tests' | 'ratings'>('users');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchUsers = useCallback(async () => {
    try {
      const allUsers = await getAllUsers();
      // Kullanıcıları kayıt tarihine göre sırala (en yeni üstte)
      const sortedUsers = allUsers.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.lastLogin || 0);
        const dateB = new Date(b.createdAt || b.lastLogin || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setUsers(sortedUsers);
      setLastRefresh(new Date());
    } catch {
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const allCourses = await getAllCourses(); // API'den çek
      setCourses(allCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Eğitimler yüklenirken hata oluştu');
    }
  }, []);

  const fetchTests = useCallback(async () => {
    try {
      const allTests = getAllTests();
      setTests(allTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Testler yüklenirken hata oluştu');
    }
  }, []);

  const refreshTestsData = useCallback(async () => {
    try {
      const refreshedTests = refreshTests();
      setTests(refreshedTests);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing tests:', error);
      setError('Testler yenilenirken hata oluştu');
    }
  }, []);

  const reloadTestsData = useCallback(async () => {
    try {
      const reloadedTests = reloadTests();
      setTests(reloadedTests);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error reloading tests:', error);
      setError('Testler yeniden yüklenirken hata oluştu');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchTests();
  }, [fetchUsers, fetchCourses, fetchTests]);

  // Real-time güncelleme
  const handleRealTimeUpdate = useCallback(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'courses') {
      fetchCourses();
    } else if (activeTab === 'tests') {
      fetchTests();
    }
  }, [activeTab, fetchUsers, fetchCourses, fetchTests]);

  useRealTimeUpdates({
    onUpdate: handleRealTimeUpdate,
    interval: 2000, // 2 saniye
    enabled: true
  });



  const handleLogout = async () => {
    await logout();
  };

  const handleSaveCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>) => {
    console.log('handleSaveCourse called with:', courseData);
    console.log('editingCourse:', editingCourse);
    
    try {
      let updatedCourses: Course[];
      
      if (editingCourse) {
        console.log('Updating course with ID:', editingCourse.id);
        const updatedCourse = updateCourse(editingCourse.id, courseData);
        console.log('updateCourse result:', updatedCourse);
        
        if (!updatedCourse) {
          console.error('updateCourse returned null');
          setError('Eğitim güncellenirken hata oluştu');
          return;
        }
        console.log('Course updated successfully:', updatedCourse);
        updatedCourses = courses.map(c => c.id === editingCourse.id ? updatedCourse : c);
      } else {
        console.log('Adding new course');
        const newCourse = addCourse({
          ...courseData,
          authorId: currentUser?.id || '1',
        });
        console.log('Course added successfully:', newCourse);
        updatedCourses = [...courses, newCourse];
      }
      
      // API'ye kaydet
      const success = await saveCoursesToFile(updatedCourses);
      if (!success) {
        setError('Eğitim kaydedilirken hata oluştu');
        return;
      }
      
      // Yeniden yükle
      await fetchCourses();

      setShowAddCourse(false);
      setEditingCourse(null);
      setError(''); // Hata mesajını temizle
      console.log('handleSaveCourse completed successfully');
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Eğitim kaydedilirken hata oluştu');
    }
  };

  const handleSaveTest = async (testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>) => {
    try {
      let updatedTests: Test[];
      
      if (editingTest) {
        const updatedTest = updateTest(editingTest.id, testData);
        if (!updatedTest) {
          setError('Test güncellenirken hata oluştu');
          return;
        }
        updatedTests = tests.map(t => t.id === editingTest.id ? updatedTest : t);
      } else {
        const newTest = addTest({
          ...testData,
          authorId: currentUser?.id || 'admin',
        });
        updatedTests = [...tests, newTest];
      }
      
      // API'ye kaydet
      const success = await saveTestsToFile(updatedTests);
      if (!success) {
        setError('Test kaydedilirken hata oluştu');
        return;
      }
      
      // Yeniden yükle
      await fetchTests();

      setShowAddTest(false);
      setEditingTest(null);
      setError('');
    } catch (error) {
      console.error('Error saving test:', error);
      setError('Test kaydedilirken hata oluştu');
    }
  };

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 pt-16 pb-6 sm:px-0">
            <div className="mb-8">
              <div>
                <h1 className="text-4xl font-bold">
                  <span className="gradient-text">Admin Panel</span>
                </h1>
                <p className="text-slate-600 mt-2">
                  Kullanıcı ve eğitim yönetimi
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'users'
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    Kullanıcılar
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'courses'
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    Eğitimler
                  </button>
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'tests'
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    Testler
                  </button>
                  <button
                    onClick={() => setActiveTab('ratings')}
                    className={`py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'ratings'
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    Puanlamalar
                  </button>
                </nav>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        <span className="gradient-text">Kullanıcılar</span>
                      </CardTitle>
                      <CardDescription className="text-slate-600 mt-2">
                        Sistemde kayıtlı tüm kullanıcıları görüntüleyin
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-slate-500 bg-white/60 px-3 py-1 rounded-lg">
                        Son güncelleme: {lastRefresh.toLocaleTimeString('tr-TR')}
                      </div>
                      <Button 
                        onClick={fetchUsers} 
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? 'Yenileniyor...' : '🔄 Yenile'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-slate-100 to-blue-100/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                              E-posta
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                              Rol
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                              Kayıt Tarihi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {users.map((user, index) => (
                            <tr key={user.id} className={`hover:bg-slate-50/80 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                                    user.role === 'admin'
                                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                  }`}
                                >
                                  {user.role === 'admin' ? 'Admin' : 'Öğrenci'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {user.createdAt ? 
                                  new Date(user.createdAt).toLocaleDateString('tr-TR') :
                                  user.lastLogin ? 
                                    new Date(user.lastLogin).toLocaleDateString('tr-TR') :
                                    'Bilinmiyor'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">
                      <span className="gradient-text">Eğitimler</span>
                    </h2>
                    <p className="text-slate-600 mt-2">Tüm eğitimleri yönetin</p>
                  </div>
                  <Button 
                    onClick={() => setShowAddCourse(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                  >
                    Yeni Eğitim Ekle
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <Card key={course.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900">{course.title}</CardTitle>
                            <CardDescription className="mt-2 text-slate-600">
                              {course.description}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={() => setEditingCourse(course)}
                            >
                              Düzenle
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={async () => {
                                if (confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) {
                                  try {
                                    const success = deleteCourse(course.id);
                                    if (success) {
                                      // Güncellenmiş kurs listesini al
                                      const updatedCourses = courses.filter(c => c.id !== course.id);
                                      
                                      // API'ye kaydet
                                      const saveSuccess = await saveCoursesToFile(updatedCourses);
                                      if (!saveSuccess) {
                                        setError('Eğitim silinirken hata oluştu');
                                        return;
                                      }
                                      
                                      // Yeniden yükle
                                      await fetchCourses();
                                      
                                      setError(''); // Hata mesajını temizle
                                    } else {
                                      setError('Eğitim silinirken hata oluştu');
                                    }
                                  } catch (error) {
                                    console.error('Error deleting course:', error);
                                    setError('Eğitim silinirken hata oluştu');
                                  }
                                }
                              }}
                            >
                              Sil
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Tür:</span>
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                              {COURSE_TYPES.find(t => t.value === course.type)?.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Kategori:</span>
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{course.category}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Durum:</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                              course.isPublished ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                            }`}>
                              {course.isPublished ? 'Yayında' : 'Taslak'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tests Tab */}
            {activeTab === 'tests' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">
                      <span className="gradient-text">Testler</span>
                    </h2>
                    <p className="text-slate-600 mt-2">Tüm testleri yönetin</p>
                    <div className="text-sm text-slate-500 mt-2 bg-white/60 px-3 py-1 rounded-lg inline-block">
                      {tests.length} test • Son güncelleme: {lastRefresh.toLocaleTimeString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => setShowAddTest(true)}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                    >
                      Yeni Test Ekle
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map(test => (
                    <Card key={test.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900">{test.title}</CardTitle>
                            <CardDescription className="mt-2 text-slate-600">
                              {test.description}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={() => setEditingTest(test)}
                            >
                              Düzenle
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                              onClick={async () => {
                                if (confirm('Bu testi silmek istediğinizden emin misiniz?')) {
                                  try {
                                    const success = deleteTest(test.id);
                                    if (success) {
                                      // Güncellenmiş test listesini al
                                      const updatedTests = tests.filter(t => t.id !== test.id);
                                      
                                      // API'ye kaydet
                                      const saveSuccess = await saveTestsToFile(updatedTests);
                                      if (!saveSuccess) {
                                        setError('Test silinirken hata oluştu');
                                        return;
                                      }
                                      
                                      // Yeniden yükle
                                      await fetchTests();
                                      
                                      setError(''); // Hata mesajını temizle
                                    } else {
                                      setError('Test silinirken hata oluştu');
                                    }
                                  } catch (error) {
                                    console.error('Error deleting test:', error);
                                    setError('Test silinirken hata oluştu');
                                  }
                                }
                              }}
                            >
                              Sil
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Kategori:</span>
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{test.category}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Soru Sayısı:</span>
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{test.questionCount}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Süre:</span>
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">30 dk</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-slate-500">Durum:</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                              test.isPublished ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                            }`}>
                              {test.isPublished ? 'Yayında' : 'Taslak'}
                            </span>
                          </div>
                          {test.relatedContentTitle && (
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-semibold text-slate-500">İlgili İçerik:</span>
                              <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{test.relatedContentTitle}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold">
                    <span className="gradient-text">Puanlama İstatistikleri</span>
                  </h2>
                  <p className="text-slate-600 mt-2">Tüm eğitimlerin puanlama istatistiklerini görüntüleyin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                      <RatingStats
                        contentId={course.id}
                        contentTitle={course.title}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Modal */}
            <CourseModal
              isOpen={showAddCourse || !!editingCourse}
              onClose={() => {
                setShowAddCourse(false);
                setEditingCourse(null);
              }}
              onSave={handleSaveCourse}
              editingCourse={editingCourse}
            />

            {/* Test Modal */}
            <TestModal
              isOpen={showAddTest || !!editingTest}
              onClose={() => {
                setShowAddTest(false);
                setEditingTest(null);
              }}
              onSave={handleSaveTest}
              editingTest={editingTest}
            />
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
