export interface IDiary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'sweet' | 'touched' | 'sad' | 'angry' | 'reconcile';
  images: string[];
  relatedAnniversaryId?: string;
  createdAt: string;
}

export interface IAnniversary {
  id: string;
  title: string;
  date: string;
  isLunar: boolean;
  isRecurring: boolean;
  icon: string;
  description?: string;
}

export interface IWish {
  id: string;
  title: string;
  description: string;
  expectedDate?: string;
  coverImage?: string;
  status: 'pending' | 'completed';
  completedDate?: string;
  completedNote?: string;
  completedImages?: string[];
}

export interface IAlbum {
  id: string;
  name: string;
  coverImage: string;
  photoCount: number;
  photos: IPhoto[];
}

export interface IPhoto {
  id: string;
  url: string;
  description?: string;
  takenDate?: string;
  location?: string;
  albumId: string;
}

export interface ICheckin {
  id: string;
  title: string;
  description?: string;
  icon: string;
  isCompleted: boolean;
  completedDate?: string;
  completedProof?: string;
  category: 'travel' | 'daily' | 'activity' | 'food';
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}