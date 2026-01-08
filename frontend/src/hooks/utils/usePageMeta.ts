import { PageMeta } from "@/types/PageMeta";
import { pageMetaRecord } from "@/utils/pageNavigationMeta";

export function usePageMeta(pageKey: string, overrides?: Partial<PageMeta>) {
  const base = pageMetaRecord[pageKey];

  return {
    ...base,
    ...overrides,
  };
}
