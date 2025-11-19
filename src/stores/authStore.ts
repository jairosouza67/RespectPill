import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { uploadAvatar as uploadAvatarToStorage } from '../lib/storage';

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

interface Profile {
  id: string;
  userId: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goals?: string[];
  restrictions?: string[];
  experienceLevel?: string;
  dailyTimePreference?: string;
  consentFlags?: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  workSchedule?: string;
  sleepHours?: number;
  allergies?: string[];
  injuries?: string[];
  priorityGoals?: string[];
}

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Fetch profile
          const docRef = doc(db, 'profiles', firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          let profile = null;
          if (docSnap.exists()) {
            profile = { id: docSnap.id, ...docSnap.data() } as Profile;
          }

          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || '',
              emailVerified: firebaseUser.emailVerified
            },
            profile,
            loading: false,
            initialized: true
          });
        } else {
          set({
            user: null,
            profile: null,
            loading: false,
            initialized: true
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false, initialized: true });
    }
  },

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create initial profile
      const profileData = {
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'profiles', user.uid), profileData);

      set({
        user: {
          id: user.uid,
          email: user.email!,
          name: '',
          emailVerified: user.emailVerified
        },
        profile: { id: user.uid, ...profileData } as Profile
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  loadProfile: async (userId: string) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const profile = { id: docSnap.id, ...docSnap.data() } as Profile;
        set({ profile });
      }
    } catch (error) {
      console.error('Load profile error:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    try {
      const docRef = doc(db, 'profiles', user.id);
      await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });

      set({ profile: { ...profile, ...data } });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

    try {
      // Upload to Firebase Storage
      const avatarUrl = await uploadAvatarToStorage(file, user.id);

      // Update profile with new avatar URL
      await get().updateProfile({ avatar: avatarUrl });
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }
}));