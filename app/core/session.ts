import type { AppStage, PebbleTrailSession, SituationAnswers } from "./types";

export const SESSION_KEY = "pebbletrail.session.v1";

export function newSession(): PebbleTrailSession {
  return { version: 1, stage: "welcome", situationOne: {}, updatedAt: new Date().toISOString() };
}

export function readSession(): PebbleTrailSession {
  if (typeof window === "undefined") return newSession();
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) as PebbleTrailSession : newSession();
  } catch {
    return newSession();
  }
}

export function writeSession(stage: AppStage, situationOne: SituationAnswers) {
  const session: PebbleTrailSession = { version: 1, stage, situationOne, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
