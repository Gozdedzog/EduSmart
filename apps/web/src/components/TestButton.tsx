'use client';

export function TestButton() {
  const handleTestStart = () => {
    // TODO: Implement test start functionality
    console.log('Test started');
  };

  return (
    <div className="mb-8">
      <button 
        onClick={handleTestStart}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm"
      >
        Testi Başlat
      </button>
    </div>
  );
}
