import { PageMetaContext } from "@/components/commons/PageMetaProvider";
import { useContext } from "react";

export function usePageMetaContext() {
  const ctx = useContext(PageMetaContext);
  if (!ctx) throw new Error("usePageMetaContext must be used inside provider");
  return ctx;
}
