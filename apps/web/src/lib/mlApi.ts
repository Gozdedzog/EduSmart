/**
 * ML Prediction API Client
 * Python API'ye bağlantı için client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';

export interface TestResults {
  age: number;
  gender: string;
  video_answers: number[];
  text_answers: number[];
  time_video: number;
  time_text: number;
  time_total: number;
  video_easy: number;
  video_medium: number;
  video_hard: number;
  text_easy: number;
  text_medium: number;
  text_hard: number;
  efficiency_video: number;
  efficiency_text: number;
}

export interface PredictionResponse {
  predicted_style: string;
  confidence: number;
  video_score: number;
  text_score: number;
  video_percentage: number;
  text_percentage: number;
  recommendation: {
    content_ratio: { video: number; text: number };
    learning_tips: string[];
    study_method: string;
  };
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

export interface ModelInfoResponse {
  model_type: string;
  accuracy: string;
  classes: string[];
  features: number;
  status: string;
}

/**
 * API sağlık kontrolü
 */
export async function checkApiHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw new Error('ML API\'ye bağlanılamadı');
  }
}

/**
 * Model bilgilerini getir
 */
export async function getModelInfo(): Promise<ModelInfoResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ml/model-info`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Model info fetch failed:', error);
    throw new Error('Model bilgileri alınamadı');
  }
}

/**
 * Öğrenme tercihi tahmin et
 */
export async function predictLearningStyle(testResults: TestResults): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ml/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testResults),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction failed:', error);
    throw new Error('Tahmin yapılamadı');
  }
}

/**
 * Test sonuçlarını API formatına dönüştür
 */
export function formatTestResultsForApi(
  age: number,
  gender: string,
  videoAnswers: number[],
  textAnswers: number[]
): TestResults {
  return {
    age,
    gender,
    video_answers: videoAnswers,
    text_answers: textAnswers,
  };
}

/**
 * API bağlantısını test et
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    await checkApiHealth();
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}
