// import { Content } from './data'; // Unused for now

export type EventType =
  | 'page_view'
  | 'content_start'
  | 'content_complete'
  | 'reaction';

export interface Event {
  id: string;
  userId: string;
  type: EventType;
  contentId?: string;
  dwellMs?: number;
  outcome?: 'started' | 'completed' | 'abandoned';
  tagsSnapshot?: string[];
  difficultySnapshot?: 'EASY' | 'MEDIUM' | 'HARD';
  payload?: any;
  ts: number;
}

export interface ScoreItem {
  contentId: string;
  score: number;
  reasons?: string[];
}

export interface Recommendation {
  items: ScoreItem[];
  userId: string;
  generatedAt: number;
}
