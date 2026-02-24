import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type MoodEntry = {
  mood: string;
  emoji: string;
  confidence: number;
  description: string;
  timestamp: Date;
};

export type StoredMoodEntry = MoodEntry & { id: string };

export async function saveMood(
  userId: string,
  entry: Omit<MoodEntry, 'timestamp'>,
): Promise<void> {
  await addDoc(collection(db, 'users', userId, 'moods'), {
    ...entry,
    timestamp: Timestamp.now(),
  });
}

export async function getMoodHistory(
  userId: string,
  count: number = 30,
): Promise<StoredMoodEntry[]> {
  const q = query(
    collection(db, 'users', userId, 'moods'),
    orderBy('timestamp', 'desc'),
    limit(count),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      mood: data.mood,
      emoji: data.emoji,
      confidence: data.confidence,
      description: data.description,
      timestamp: data.timestamp.toDate(),
    };
  });
}
