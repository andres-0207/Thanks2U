export interface Post {
  id: string;
  content: string;
  image?: string;
  date: string;
  likes: number;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string; // Lucide icon name representation
}

export interface Student {
  id: string;
  name: string;
  major: string; // Carrera
  bio: string;
  profilePic: string;
  achievements: Achievement[];
  posts: Post[];
  ticketsSold: number;
  ticketsGoal: number;
  email: string; // For login simulation
  themeColor: string; // hex code or tailwind color name
}

export enum Page {
  LANDING = 'LANDING',
  GALLERY = 'GALLERY',
  PROFILE = 'PROFILE',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}

export interface UserSession {
  studentId: string;
  isAuthenticated: boolean;
}