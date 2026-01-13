/* eslint-disable react-refresh/only-export-components */
// PageMetaContext.tsx
import { createContext, useState, ReactNode } from "react";
import { PageMeta } from "@/types/PageMeta";

/**
 * Valeur stockée par le context
 *  - meta : méta-données de la page
 *  - setMeta : fonction de mise à jour de la valeur du context
 */
type PageMetaContextValue = {
  meta: PageMeta;
  setMeta: (meta: Partial<PageMeta>) => void;
};

//Contexte des méta-données de la page courante
export const PageMetaContext = createContext<PageMetaContextValue | null>(null);

//Provider des méta-données stockée dans le contexte
export function PageMetaProvider({
  children,
  initialMeta,
}: {
  children: ReactNode;
  initialMeta: PageMeta;
}) {
  const [meta, setMetaState] = useState<PageMeta>(initialMeta);

  const setMeta = (overrides: Partial<PageMeta>) => {
    setMetaState((prev) => ({ ...prev, ...overrides }));
  };

  return (
    <PageMetaContext.Provider value={{ meta, setMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
}
