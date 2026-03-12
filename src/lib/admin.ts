import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const ADMIN_EMAILS = [
  'fabiopalacioschwingel@gmail.com'
];

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
