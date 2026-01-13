import { Dispatch, SetStateAction, useState } from "react";
import { clsx } from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

/**
 * Propriété du paginationWrapper
 *
 *  - page : la page courante
 *  - setPage : Fonction de mise à jour de la page
 *  - totalItems : le nombre total d'éléments disponibles
 *  - totalPages : le nombre total de pages disponibles
 */
type PaginationProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalItems: number;
  totalPages: number;
};

/**
 * Encapsule la logique des paginations en utilisant le composant de shadcn
 * @param {PaginationProps} param0 - Propriété du paginationWrapper
 */
export default function PaginationWrapper({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className={clsx("flex h-fit w-full justify-center pb-4")}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to first page"
              size="icon"
              className="rounded-sm hover:bg-sky-100"
              onClick={() => setPage(1)}
            >
              <ChevronFirstIcon className="size-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to previous page"
              size="icon"
              className="rounded-sm hover:bg-sky-100"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              <ChevronLeftIcon className="size-4" />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <Select
              value={String(page)}
              onValueChange={(value) => setPage(parseInt(value))}
              aria-label="Select page"
            >
              <SelectTrigger
                id="select-page"
                className="w-fit whitespace-nowrap focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                aria-label="Select page"
              >
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {pages.map((page) => (
                  <SelectItem
                    key={page}
                    value={String(page)}
                    className="transition-colors focus:bg-sky-100"
                  >
                    Page {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to next page"
              size="icon"
              className="rounded-sm hover:bg-sky-100"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              <ChevronRightIcon className="size-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to last page"
              size="icon"
              className="rounded-sm hover:bg-sky-100"
              onClick={() => setPage(totalPages)}
            >
              <ChevronLastIcon className="size-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
