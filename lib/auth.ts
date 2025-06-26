'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';
import { mockUsers } from './mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username, password) => {
        // For demo purposes, we'll use a simple mock authentication
        // In a real app, you would call an API endpoint
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Simple validation - in a real app this would be done securely on the server
          if (username === 'admin' && password === 'password') {
            const user = mockUsers.find(u => u.name.toLowerCase() === 'marie martin') || mockUsers[0];
            set({ user, isAuthenticated: true });
            return { success: true, message: 'Connexion réussie!' };
          } else if (username === 'user' && password === 'password') {
            const user = mockUsers.find(u => u.name.toLowerCase() === 'jean dupont') || mockUsers[0];
            set({ user, isAuthenticated: true });
            return { success: true, message: 'Connexion réussie!' };
          }
          
          return { success: false, message: 'Identifiants invalides.' };
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, message: 'Une erreur est survenue lors de la connexion.' };
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);