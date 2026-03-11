export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isVip: boolean;
  vipSince?: any;
  lastPaymentStatus?: string;
  state?: string;
  city?: string;
  bio?: string;
  role?: 'parent' | 'professional' | 'autistic' | 'other' | 'admin';
}

export interface SosCard {
  id?: string;
  userId: string;
  childName: string;
  birthDate: string;
  bloodType: string;
  allergies: string;
  observations: string;
  contact1Name: string;
  contact1Phone: string;
  contact2Name: string;
  contact2Phone: string;
  homeAddress: string;
  workAddress: string;
  createdAt: any;
}

export interface Post {
  id: string;
  text: string;
  content: string;
  authorId: string;
  userId: string;
  authorName: string;
  authorPhoto?: string;
  mediaType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  topic: 'geral' | 'noticias' | 'duvidas' | 'conquistas' | 'eventos';
  state: string;
  city: string;
  location: string;
  timestamp: any;
  createdAt: any;
  isVip: boolean;
  isGlobal: boolean;
  likes?: string[];
  commentsCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  text: string;
  timestamp: any;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  type: 'mensal' | 'anual';
}
