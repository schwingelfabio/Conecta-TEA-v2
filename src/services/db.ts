import { doc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db as firestore, auth } from '../firebase';
import { SofiaSession, SofiaMessage, SofiaSummary, SofiaSafetyEvent, SofiaUser } from '../types/sofia';
import { logger } from './logger';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  logger.error('Database', 'Firestore Error', errInfo);
  throw new Error(JSON.stringify(errInfo));
}

function cleanData(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;
  
  const newObj: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== undefined) {
        newObj[key] = cleanData(value);
      }
    }
  }
  return newObj;
}

class FirebaseDatabase {
  async saveUser(user: SofiaUser) {
    const path = `sofia_users/${user.id}`;
    try {
      await setDoc(doc(firestore, 'sofia_users', user.id), cleanData(user));
      logger.info('Database', 'User saved', { id: user.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async saveSession(session: SofiaSession) {
    const path = `sofia_sessions/${session.id}`;
    try {
      await setDoc(doc(firestore, 'sofia_sessions', session.id), cleanData(session));
      logger.info('Database', 'Session saved', { id: session.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async updateSession(sessionId: string, updates: Partial<SofiaSession>) {
    const path = `sofia_sessions/${sessionId}`;
    try {
      await updateDoc(doc(firestore, 'sofia_sessions', sessionId), cleanData(updates));
      logger.info('Database', 'Session updated', { id: sessionId });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  async saveMessage(message: SofiaMessage) {
    const path = `sofia_messages/${message.id}`;
    try {
      await setDoc(doc(firestore, 'sofia_messages', message.id), cleanData(message));
      logger.info('Database', 'Message saved', { id: message.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async saveSummary(summary: SofiaSummary) {
    const path = `sofia_summaries/${summary.id}`;
    try {
      await setDoc(doc(firestore, 'sofia_summaries', summary.id), cleanData(summary));
      logger.info('Database', 'Summary saved', { id: summary.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async saveSafetyEvent(event: SofiaSafetyEvent) {
    const path = `sofia_safety_events/${event.id}`;
    try {
      await setDoc(doc(firestore, 'sofia_safety_events', event.id), cleanData(event));
      logger.info('Database', 'Safety Event saved', { id: event.id });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}

export const db = new FirebaseDatabase();
