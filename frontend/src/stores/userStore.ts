import { create } from "zustand";
import { User } from "../types/User";
import { persist, createJSONStorage } from "zustand/middleware";
import { logoutRequest } from "../api/auth.api";

/**
 * UserStore représente l’état global lié à l’utilisateur dans l'application
 *
 * - user contient les informations de l’utilisateur connecté,
 *    ou null si personne n'est connecté.
 * - token d'authentification
 * - isAuthenticated conserve le status de connexion de l'utilisateur
 * - setUser met à jour l’utilisateur dans le store
 * - setToken met à jour le token d'authentification
 * - logout réinitialise l’état en supprimant l’utilisateur courant
 *
 * Cette interface est utilisée par Zustand pour typer le store.
 */
interface UserStore {
  user: User | null;
  token:string|null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  setToken:(t:string|null)=>void;
  logout: () => Promise<void>;
}

/**
 * Creer le store pour conserver l'utilisateur connecté
 * Conserve l'utilisateur dans le local storage pour des fins de persistance (ex:lors d'un refresh)
 */
export const userStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: true }),
            setToken: (token) => set({ token }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
