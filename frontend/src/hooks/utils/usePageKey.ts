import { useLocation } from "react-router-dom";

export function usePageKey() {
  const { pathname } = useLocation();

  // /tasks/42 → ["", "tasks", "42"]
  const segments = pathname.split("/").filter(Boolean);

  // Si aucune route → dashboard
  if (segments.length === 0) return "dashboard";

  // Le premier segment = la page principale
  return segments[0];
}
