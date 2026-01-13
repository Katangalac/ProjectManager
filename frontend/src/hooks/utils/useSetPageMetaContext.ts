import { usePageMetaContext } from "./usePageMetaContext";
import { PageMeta } from "@/types/PageMeta";

export function useSetPageMeta() {
  const { setMeta } = usePageMetaContext();
  return (meta: Partial<PageMeta>) => setMeta(meta);
}
