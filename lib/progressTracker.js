// /lib/progressTracker.js
"use client";
import { db, auth } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Firebase için
export async function updateTopicStat(result) {
  const user = auth.currentUser;
  if (!user || !result?.topic) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  let stats = snap.data()?.topicStats || {};

  if (!stats[result.topic]) stats[result.topic] = { correct: 0, wrong: 0 };

  stats[result.topic].correct += result.correctCount;
  stats[result.topic].wrong += result.wrongCount;

  await updateDoc(userRef, { topicStats: stats });
}

export async function calculateProgress() {
  const user = auth.currentUser;
  if (!user) return 0;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return 0;

  const stats = snap.data()?.topicStats || {};
  const topics = Object.values(stats);

  if (topics.length === 0) return 0;

  const completed = topics.filter(t => t.correct >= t.wrong * 1.5).length;
  const total = topics.length;

  return Math.round((completed / total) * 100);
}

// LocalStorage için eski fonksiyon
export function updateProgress(subject, topic, score) {
  const key = "studyProgress";
  const data = JSON.parse(localStorage.getItem(key)) || {};

  const prev = data?.[subject]?.[topic] || 0;
  const weighted = Math.min(prev + score * 0.5, 100);

  const updated = {
    ...data,
    [subject]: {
      ...(data[subject] || {}),
      [topic]: weighted
    }
  };

  localStorage.setItem(key, JSON.stringify(updated));
}
