'use client';

import { useState, useEffect } from 'react';

interface MathTrigIntroModalProps {
  open: boolean;
  onClose: () => void;
}

interface TestResult {
  text_score?: number;
  video_score?: number;
}

// Analytics tracking (non-blocking)
const track = (event: string, data: any) => {
  console.log('Analytics:', event, data);
  // Future: Send to analytics service
};

// Quiz questions
const QUIZ_QUESTIONS = [
  {
    question: 'Trigonometride kaç temel oran vardır?',
    options: ['2', '3', '4', '5'],
    correct: 1,
  },
  {
    question: 'Sinüs oranı hangi formülle hesaplanır?',
    options: [
      'karşı kenar / hipotenüs',
      'komşu kenar / hipotenüs',
      'karşı kenar / komşu kenar',
      'hipotenüs / karşı kenar',
    ],
    correct: 0,
  },
  {
    question: 'Kosinüs oranı hangi formülle hesaplanır?',
    options: [
      'karşı kenar / hipotenüs',
      'komşu kenar / hipotenüs',
      'karşı kenar / komşu kenar',
      'hipotenüs / komşu kenar',
    ],
    correct: 1,
  },
  {
    question: 'Tanjant oranı hangi formülle hesaplanır?',
    options: [
      'karşı kenar / hipotenüs',
      'komşu kenar / hipotenüs',
      'karşı kenar / komşu kenar',
      'hipotenüs / karşı kenar',
    ],
    correct: 2,
  },
  {
    question: 'Trigonometri hangi matematik alanlarının birleşimidir?',
    options: [
      'Aritmetik ve Cebir',
      'Geometri ve Cebir',
      'Geometri ve Aritmetik',
      'Cebir ve Analiz',
    ],
    correct: 1,
  },
  {
    question: 'Bir dik üçgende hipotenüs nedir?',
    options: [
      'En kısa kenar',
      'En uzun kenar',
      'Dik açının karşısındaki kenar',
      'Dik açıyı oluşturan kenarlardan biri',
    ],
    correct: 2,
  },
  {
    question: '30° açısının sinüs değeri kaçtır?',
    options: ['0.5', '0.707', '0.866', '1'],
    correct: 0,
  },
  {
    question: '45° açısının kosinüs değeri kaçtır?',
    options: ['0.5', '0.707', '0.866', '1'],
    correct: 1,
  },
  {
    question: 'Birim çemberde sin²θ + cos²θ = ?',
    options: ['0', '1', '2', 'θ'],
    correct: 1,
  },
  {
    question: 'Trigonometrik fonksiyonlar hangi aralıkta değer alır?',
    options: [
      '0 ile 1 arasında',
      '-1 ile 1 arasında',
      '0 ile 2π arasında',
      'Sınırsız',
    ],
    correct: 1,
  },
];

export default function MathTrigIntroModal({
  open,
  onClose,
}: MathTrigIntroModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [testResults, setTestResults] = useState<TestResult>({});
  const [showTextTest, setShowTextTest] = useState(false);
  const [showVideoTest, setShowVideoTest] = useState(false);

  // Load existing scores from localStorage
  useEffect(() => {
    if (open) {
      track('open_modal', { content_id: 'math-trig-intro' });

      const textScore = localStorage.getItem('learning.math_trig.text_score');
      const videoScore = localStorage.getItem('learning.math_trig.video_score');

      const results: TestResult = {};
      if (textScore) results.text_score = parseInt(textScore);
      if (videoScore) results.video_score = parseInt(videoScore);

      setTestResults(results);

      // Set current step based on completed tests
      if (
        results.text_score !== undefined &&
        results.video_score === undefined
      ) {
        setCurrentStep(2);
      } else if (
        results.text_score !== undefined &&
        results.video_score !== undefined
      ) {
        setCurrentStep(2); // Show final step
      }
    }
  }, [open]);

  const handleTextTestComplete = (score: number) => {
    const newResults = { ...testResults, text_score: score };
    setTestResults(newResults);
    localStorage.setItem('learning.math_trig.text_score', score.toString());
    setShowTextTest(false);
    setCurrentStep(2);
    track('submit_test', { mode: 'text', score });
  };

  const handleVideoTestComplete = (score: number) => {
    const newResults = { ...testResults, video_score: score };
    setTestResults(newResults);
    localStorage.setItem('learning.math_trig.video_score', score.toString());
    setShowVideoTest(false);
    track('submit_test', { mode: 'video', score });
  };

  const startTextTest = () => {
    setShowTextTest(true);
    track('start_test', { mode: 'text' });
  };

  const startVideoTest = () => {
    setShowVideoTest(true);
    track('start_test', { mode: 'video' });
  };

  const retakeTest = (mode: 'text' | 'video') => {
    if (mode === 'text') {
      setCurrentStep(1);
      setTestResults(prev => ({ ...prev, text_score: undefined }));
      localStorage.removeItem('learning.math_trig.text_score');
    } else {
      setTestResults(prev => ({ ...prev, video_score: undefined }));
      localStorage.removeItem('learning.math_trig.video_score');
    }
  };

  if (!open) return null;

  if (showTextTest) {
    return (
      <QuizComponent
        mode="text"
        onComplete={handleTextTestComplete}
        onClose={() => setShowTextTest(false)}
      />
    );
  }

  if (showVideoTest) {
    return (
      <QuizComponent
        mode="video"
        onComplete={handleVideoTestComplete}
        onClose={() => setShowVideoTest(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Trigonometriye Giriş
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Progress Stepper */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div
                className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {testResults.text_score !== undefined ? '✓' : '1'}
                </div>
                <span className="text-sm font-medium">Metin İçeriği</span>
              </div>

              <div
                className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}
              ></div>

              <div
                className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-slate-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {testResults.video_score !== undefined ? '✓' : '2'}
                </div>
                <span className="text-sm font-medium">Video İçeriği</span>
              </div>
            </div>

            {/* Step 1: Text Content */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Trigonometriye Giriş – Text Content
                  </h3>

                  <div className="prose max-w-none text-slate-700 space-y-4">
                    <p>
                      Trigonometri, üçgenlerin açıları ve kenarları arasındaki
                      ilişkileri inceleyen matematik dalıdır. Bu konu, geometri
                      ve cebirin birleştiği önemli bir alandır.
                    </p>

                    <h4 className="text-md font-semibold text-slate-900">
                      Temel Kavramlar
                    </h4>
                    <p>
                      Trigonometride üç temel oran vardır: sinüs (sin), kosinüs
                      (cos) ve tanjant (tan). Bu oranlar, bir dik üçgende
                      açıların kenarlarla olan ilişkisini gösterir.
                    </p>

                    <h4 className="text-md font-semibold text-slate-900">
                      Sinüs (Sin)
                    </h4>
                    <p>
                      Sinüs, bir açının karşı kenarının hipotenüse oranıdır. Dik
                      üçgende sin(θ) = karşı kenar / hipotenüs formülü ile
                      hesaplanır.
                    </p>

                    <h4 className="text-md font-semibold text-slate-900">
                      Kosinüs (Cos)
                    </h4>
                    <p>
                      Kosinüs, bir açının komşu kenarının hipotenüse oranıdır.
                      Dik üçgende cos(θ) = komşu kenar / hipotenüs formülü ile
                      hesaplanır.
                    </p>

                    <h4 className="text-md font-semibold text-slate-900">
                      Tanjant (Tan)
                    </h4>
                    <p>
                      Tanjant, bir açının karşı kenarının komşu kenara oranıdır.
                      Dik üçgende tan(θ) = karşı kenar / komşu kenar formülü ile
                      hesaplanır.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={startTextTest}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Teste Başla
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Video Content */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Trigonometriye Giriş – Video Content
                  </h3>

                  <div className="space-y-4">
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/McV7VSXzUDs"
                        title="Introduction to Trigonometry"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    <p className="text-slate-600 text-center">
                      Video içeriğini izledikten sonra bilginizi test
                      edebilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={startVideoTest}
                    disabled={testResults.text_score === undefined}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      testResults.text_score === undefined
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    title={
                      testResults.text_score === undefined
                        ? 'Önce metin testini tamamlayın'
                        : ''
                    }
                  >
                    {testResults.text_score === undefined
                      ? 'Metin Testini Tamamlayın'
                      : 'Teste Başla'}
                  </button>
                </div>
              </div>
            )}

            {/* Results Summary */}
            {(testResults.text_score !== undefined ||
              testResults.video_score !== undefined) && (
              <div className="mt-8 bg-slate-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Test Sonuçları
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testResults.text_score !== undefined && (
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-slate-900">
                            Metin İçeriği
                          </h5>
                          <p className="text-2xl font-bold text-blue-600">
                            {testResults.text_score}/10
                          </p>
                        </div>
                        <button
                          onClick={() => retakeTest('text')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Tekrar Al
                        </button>
                      </div>
                    </div>
                  )}
                  {testResults.video_score !== undefined && (
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-slate-900">
                            Video İçeriği
                          </h5>
                          <p className="text-2xl font-bold text-green-600">
                            {testResults.video_score}/10
                          </p>
                        </div>
                        <button
                          onClick={() => retakeTest('video')}
                          className="text-sm text-green-600 hover:text-green-800"
                        >
                          Tekrar Al
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {testResults.text_score !== undefined &&
                  testResults.video_score !== undefined && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Karşılaştırma:</strong> Metin:{' '}
                        {testResults.text_score}/10, Video:{' '}
                        {testResults.video_score}/10
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Component
interface QuizComponentProps {
  mode: 'text' | 'video';
  onComplete: (score: number) => void;
  onClose: () => void;
}

function QuizComponent({ mode, onComplete, onClose }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter(
        (answer, index) => answer === QUIZ_QUESTIONS[index].correct
      ).length;
      setShowResults(true);

      // Complete test after showing results
      setTimeout(() => {
        onComplete(correctAnswers);
      }, 2000);
    }
  };

  if (showResults) {
    const correctAnswers = answers.filter(
      (answer, index) => answer === QUIZ_QUESTIONS[index].correct
    ).length;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          ></div>

          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                {mode === 'text' ? 'Metin İçeriği' : 'Video İçeriği'} Test
                Sonucu
              </h2>
              <div className="space-y-4">
                <div className="text-6xl font-bold text-blue-600">
                  {correctAnswers}/10
                </div>
                <p className="text-slate-600">
                  {correctAnswers} / {QUIZ_QUESTIONS.length} soru doğru
                </p>
                <p className="text-sm text-slate-500">
                  Sonuçlar kaydediliyor...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {mode === 'text' ? 'Metin İçeriği' : 'Video İçeriği'} Testi
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium text-slate-900">
                {currentQ.question}
              </h3>

              <div className="space-y-2">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
