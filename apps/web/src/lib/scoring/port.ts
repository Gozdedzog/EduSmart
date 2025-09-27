import { Recommendation } from '../types';

export interface ScoringPort {
  score(userId: string): Promise<Recommendation>;
}
