'use client';

import { useState, useEffect } from 'react';
import { getContents } from '@/lib/store';

interface HealthResponse {
  ok: boolean;
  mode: string;
}

interface RecommendationResponse {
  items: Array<{
    contentId: string;
    score: number;
    reasons?: string[];
  }>;
  contentsExpanded: Array<{
    contentId: string;
    score: number;
    title: string;
    kind: string;
    tags: string[];
    level: string;
    minutes: number;
    reasons?: string[];
  }>;
}

export default function LabPage() {
  const [userId, setUserId] = useState('u1');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const contents = getContents();

  useEffect(() => {
    // Load health status on mount
    fetch('/api/health')
      .then(res => res.json())
      .then(setHealth)
      .catch(console.error);
  }, []);

  const sendTestEvent = async () => {
    if (!contents.length) return;

    const randomContent = contents[Math.floor(Math.random() * contents.length)];

    const eventData = {
      userId,
      type: 'content_complete',
      contentId: randomContent.id,
      outcome: 'completed',
      tagsSnapshot: randomContent.tags,
      difficultySnapshot:
        randomContent.level === 'Başlangıç'
          ? 'EASY'
          : randomContent.level === 'Orta'
            ? 'MEDIUM'
            : 'HARD',
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        setMessage(`Test olayı gönderildi: ${randomContent.title}`);
      } else {
        setMessage('Olay gönderilirken hata oluştu');
      }
    } catch {
      setMessage('Bağlantı hatası');
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recommend?userId=${userId}`);
      const data = await response.json();
      setRecommendations(data);
      setMessage('');
    } catch {
      setMessage('Öneri alınırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Kişiselleştirme Laboratuvarı
        </h1>
        <p className="text-slate-600">
          Model performansını test etmek ve kişiselleştirme önerilerini görmek
          için bu sayfayı kullanın.
        </p>
      </div>

      {/* Health Status */}
      {health && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Sistem Durumu</h3>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${health.ok ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
            <span className="text-sm text-slate-600">
              Mod: {health.mode} | Durum: {health.ok ? 'Aktif' : 'Hata'}
            </span>
          </div>
        </div>
      )}

      {/* User Input */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Kullanıcı ID</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Kullanıcı ID girin"
          />
        </div>
      </div>

      {/* Test Actions */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Test İşlemleri</h3>
        <div className="flex gap-3">
          <button
            onClick={sendTestEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Olay Gönder
          </button>
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : 'Öneri Al'}
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      </div>

      {/* Recommendations */}
      {recommendations && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">
            Öneriler (Kullanıcı: {userId})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">İçerik</th>
                  <th className="text-left py-2">Tür</th>
                  <th className="text-left py-2">Seviye</th>
                  <th className="text-left py-2">Skor</th>
                  <th className="text-left py-2">Nedenler</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.contentsExpanded.map(item => (
                  <tr key={item.contentId} className="border-b">
                    <td className="py-2 font-medium">{item.title}</td>
                    <td className="py-2">{item.kind}</td>
                    <td className="py-2">{item.level}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-sky-100 text-sky-800 rounded text-xs">
                        {(item.score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-xs text-slate-600">
                      {item.reasons?.join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
