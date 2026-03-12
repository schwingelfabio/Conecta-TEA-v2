import { db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

const ADMIN_EMAILS = [
  'fabiopalacioschwingel@gmail.com',
  'fabiparadox2@gmail.com'
];

export async function initializeAdmins() {
  try {
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);

    if (snapshot.empty) {
      for (const rawEmail of ADMIN_EMAILS) {
        const email = rawEmail.toLowerCase().trim();
        await setDoc(doc(db, 'admins', email), {
          email,
          role: 'admin',
          createdAt: new Date()
        });
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar administradores:', error);
  }
}

export async function checkIsAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase().trim();

  try {
    if (ADMIN_EMAILS.includes(normalizedEmail)) return true;

    const adminDoc = await getDoc(doc(db, 'admins', normalizedEmail));
    return adminDoc.exists();
  } catch (error) {
    console.error('Erro ao verificar status de admin:', error);
    return ADMIN_EMAILS.includes(normalizedEmail);
  }
}
