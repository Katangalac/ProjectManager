/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from "clsx";
import { ReactNode } from "react";

/**
 * Type des options du sélecteur
 *
 * - label: titre/nom de l'option
 * - value: valeur de l'option
 * - icon: l'icône de l'option
 */
type InlineSelectorOption = {
  label: string;
  value: any;
  icon?: ReactNode;
};

/**
 * Propriétés du sélecteur
 *
 * - value: la valeur sélectionné
 * - options: la liste d'options parmi lesquelles on fait la sélection
 * - onChange: fonction appelée lorsqu'on change la valeur sélectionnée
 * - className: classe css pour le style du sélecteur
 */
type InlineSelectorProps = {
  value: any;
  options: InlineSelectorOption[];
  onChange: (value: any) => void;
  className?: string;
};

/**
 * Sélecteur inline
 * Permet de sélectionné une valeur à partir d'une liste d'options
 *
 * @param {InlineSelectorProps} param0 - propriétés du sélecteur
 */
export function InlineSelector({
  value,
  options,
  onChange,
  className = "",
}: InlineSelectorProps) {
  return (
    <div
      className={clsx(
        `flex gap-3 px-2 py-1 ${className}`,
        "rounded-md border border-sky-100 bg-sky-50"
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "flex cursor-pointer items-center gap-0.5 px-2 py-2 transition",
              "rounded-md",
              "text-xs font-medium",
              selected
                ? "border border-sky-300 bg-sky-100 text-sky-600 shadow-lg"
                : "border-gray-300 text-gray-600 hover:bg-sky-200"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
