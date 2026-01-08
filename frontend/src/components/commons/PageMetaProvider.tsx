/* eslint-disable react-refresh/only-export-components */
// PageMetaContext.tsx
import { createContext, useState, ReactNode } from "react";
import { PageMeta } from "@/types/PageMeta";

type PageMetaContextValue = {
  meta: PageMeta;
  setMeta: (meta: Partial<PageMeta>) => void;
};

export const PageMetaContext = createContext<PageMetaContextValue | null>(null);

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
