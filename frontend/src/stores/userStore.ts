import { create } from "zustand";
import { User } from "../types/User";
import { persist } from "zustand/middleware";
import { logoutRequest } from "../services/auth.services";

/**
 * UserStore représente l’état global lié à l’utilisateur dans l'application
 *
 * - user contient les informations de l’utilisateur connecté,
 *    ou null si personne n'est connecté.
 * - isAuthenticated conserve le status de connexion de l'utilisateur
 * - setUser met à jour l’utilisateur dans le store
 * - logout réinitialise l’état en supprimant l’utilisateur courant
 *
 * Cette interface est utilisée par Zustand pour typer le store.
 */
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
}

/**
 * Creer le store pour conserver l'utilisateur connecté
 * Conserve l'utilisateur dans le local storage pour des fins de persistance (ex:lors d'un refresh)
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (u) => {
        set({ user: u, isAuthenticated: true });
      },
      logout: async () => {
        try {
          await logoutRequest();
        } catch {
          console.warn("Erreur lors de la déconnexion");
        }
        localStorage.removeItem("user-storage");
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
