import { mockContents, Content } from './data';
import { Event } from './types';

// In-memory store
export const contents: Content[] = [...mockContents];
export const events: Event[] = [];

// Helper functions
export function getContents(): Content[] {
  return contents;
}

export function appendEvent(event: Event): void {
  events.push(event);
}

export function getUserEvents(userId: string, sinceMs?: number): Event[] {
  let userEvents = events.filter(e => e.userId === userId);

  if (sinceMs !== undefined) {
    const cutoffTime = Date.now() - sinceMs;
    userEvents = userEvents.filter(e => e.ts >= cutoffTime);
  }

  return userEvents.sort((a, b) => b.ts - a.ts); // Most recent first
}
