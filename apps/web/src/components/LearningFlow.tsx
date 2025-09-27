'use client';

import { useState } from 'react';

interface TestResult {
  text_score?: number;
  video_score?: number;
}

export default function LearningFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [testResults, setTestResults] = useState<TestResult>({});
  const [showTextTest, setShowTextTest] = useState(false);
  const [showVideoTest, setShowVideoTest] = useState(false);

  const handleTextTestComplete = (score: number) => {
    setTestResults(prev => ({ ...prev, text_score: score }));
    setShowTextTest(false);
    setCurrentStep(2);
  };

  const handleVideoTestComplete = (score: number) => {
    setTestResults(prev => ({ ...prev, video_score: score }));
    setShowVideoTest(false);
  };

  const startTextTest = () => {
    setShowTextTest(true);
  };

  const startVideoTest = () => {
    setShowVideoTest(true);
  };

  if (showTextTest) {
    return (
      <TestComponent onComplete={handleTextTestComplete} testType="text" />
    );
  }

  if (showVideoTest) {
    return (
      <TestComponent onComplete={handleVideoTestComplete} testType="video" />
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Trigonometri Öğrenme Akışı
        </h1>
        <p className="text-slate-600">
          Adım adım trigonometri öğrenin ve bilginizi test edin
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-center space-x-4">
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
            1
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
            2
          </div>
          <span className="text-sm font-medium">Video İçeriği</span>
        </div>
      </div>

      {/* Step 1: Text Content */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Introduction to Trigonometry - Text Content
          </h2>

          <div className="prose max-w-none text-slate-700 space-y-4">
            <p>
              Trigonometri, üçgenlerin açıları ve kenarları arasındaki
              ilişkileri inceleyen matematik dalıdır. Bu konu, geometri ve
              cebirin birleştiği önemli bir alandır.
            </p>

            <h3 className="text-lg font-semibold text-slate-900">
              Temel Kavramlar
            </h3>
            <p>
              Trigonometride üç temel oran vardır: sinüs (sin), kosinüs (cos) ve
              tanjant (tan). Bu oranlar, bir dik üçgende açıların kenarlarla
              olan ilişkisini gösterir.
            </p>

            <h3 className="text-lg font-semibold text-slate-900">
              Sinüs (Sin)
            </h3>
            <p>
              Sinüs, bir açının karşı kenarının hipotenüse oranıdır. Dik üçgende
              sin(θ) = karşı kenar / hipotenüs formülü ile hesaplanır.
            </p>

            <h3 className="text-lg font-semibold text-slate-900">
              Kosinüs (Cos)
            </h3>
            <p>
              Kosinüs, bir açının komşu kenarının hipotenüse oranıdır. Dik
              üçgende cos(θ) = komşu kenar / hipotenüs formülü ile hesaplanır.
            </p>

            <h3 className="text-lg font-semibold text-slate-900">
              Tanjant (Tan)
            </h3>
            <p>
              Tanjant, bir açının karşı kenarının komşu kenara oranıdır. Dik
              üçgende tan(θ) = karşı kenar / komşu kenar formülü ile hesaplanır.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
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
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Introduction to Trigonometry - Video Content
          </h2>

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
              Video içeriğini izledikten sonra bilginizi test edebilirsiniz.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={startVideoTest}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Teste Başla
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {(testResults.text_score !== undefined ||
        testResults.video_score !== undefined) && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Test Sonuçları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testResults.text_score !== undefined && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900">
                  Metin İçeriği Testi
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {testResults.text_score}%
                </p>
              </div>
            )}
            {testResults.video_score !== undefined && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900">
                  Video İçeriği Testi
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {testResults.video_score}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Test Component
interface TestComponentProps {
  onComplete: (score: number) => void;
  testType: 'text' | 'video';
}

function TestComponent({ onComplete, testType }: TestComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
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
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter(
        (answer, index) => answer === questions[index].correct
      ).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      setShowResults(true);

      // Complete test after showing results
      setTimeout(() => {
        onComplete(score);
      }, 2000);
    }
  };

  if (showResults) {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            {testType === 'text' ? 'Metin İçeriği' : 'Video İçeriği'} Test
            Sonucu
          </h2>
          <div className="space-y-4">
            <div className="text-6xl font-bold text-blue-600">{score}%</div>
            <p className="text-slate-600">
              {correctAnswers} / {questions.length} soru doğru
            </p>
            <p className="text-sm text-slate-500">Sonuçlar kaydediliyor...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-slate-900">
              {testType === 'text' ? 'Metin İçeriği' : 'Video İçeriği'} Testi
            </h2>
            <span className="text-sm text-slate-500">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
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
  );
}
