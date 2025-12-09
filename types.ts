export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
}

export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string; // Para vídeos
  category: string;
  caption?: string;
  date?: string;
}

export interface WishMessage {
  id: string;
  author: string;
  message: string;
  date: string;
}

export enum ThemeMode {
  DAY = 'day',
  NIGHT = 'night'
}

export interface Song {
  title: string;
  artist: string;
  duration: string; // Formatting simplicity
}

export interface UserPreferences {
  name: string;
  likes: string[];
}
