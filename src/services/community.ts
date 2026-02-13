import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  createdBy: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  createdAt: number;
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  message: string;
  timestamp: number;
  senderAvatar?: string;
}

// ===== NOTICES =====
export async function createNotice(
  title: string,
  content: string,
  priority: 'high' | 'medium' | 'low',
  createdBy: string
): Promise<Notice> {
  try {
    const docRef = await addDoc(collection(db, 'notices'), {
      title,
      content,
      priority,
      createdAt: Timestamp.now(),
      createdBy,
    });

    return {
      id: docRef.id,
      title,
      content,
      priority,
      createdAt: Date.now(),
      createdBy,
    };
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
}

export async function getAllNotices(): Promise<Notice[]> {
  try {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notices: Notice[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notices.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        priority: data.priority,
        createdAt: data.createdAt?.toDate?.().getTime?.() || Date.now(),
        createdBy: data.createdBy,
      });
    });

    return notices;
  } catch (error) {
    console.error('Error fetching notices:', error);
    throw error;
  }
}

export async function deleteNotice(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'notices', id));
  } catch (error) {
    console.error('Error deleting notice:', error);
    throw error;
  }
}

// ===== EVENTS =====
export async function createEvent(
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  createdBy: string
): Promise<Event> {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      title,
      description,
      date,
      time,
      location,
      createdAt: Timestamp.now(),
      createdBy,
    });

    return {
      id: docRef.id,
      title,
      description,
      date,
      time,
      location,
      createdAt: Date.now(),
      createdBy,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        createdAt: data.createdAt?.toDate?.().getTime?.() || Date.now(),
        createdBy: data.createdBy,
      });
    });

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// ===== CHAT MESSAGES =====
export async function sendChatMessage(
  senderName: string,
  message: string
): Promise<ChatMessage> {
  try {
    const docRef = await addDoc(collection(db, 'chatMessages'), {
      senderName,
      message,
      timestamp: Timestamp.now(),
    });

    return {
      id: docRef.id,
      senderName,
      message,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getAllChatMessages(): Promise<ChatMessage[]> {
  try {
    const q = query(collection(db, 'chatMessages'), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    const messages: ChatMessage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        senderName: data.senderName,
        message: data.message,
        timestamp: data.timestamp?.toDate?.().getTime?.() || Date.now(),
      });
    });

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function deleteChatMessage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'chatMessages', id));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}
