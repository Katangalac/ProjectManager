type ToastType =
  | "soft-info"
  | "soft-success"
  | "soft-warning"
  | "soft-error"
  | "outline-info"
  | "outline-success"
  | "outline-warning"
  | "outline-error"
  | "solid-info"
  | "solid-success"
  | "solid-warning"
  | "solid-error";

/**
 * Retourne le style de toast à utiliser par le component Sonner de Shadcn
 */
export const toastStyle: Record<ToastType, React.CSSProperties> = {
  "soft-info": {
    "--normal-bg":
      "color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))",
    "--normal-text": "light-dark(var(--color-sky-600), var(--color-sky-400))",
    "--normal-border": "light-dark(var(--color-sky-600), var(--color-sky-400))",
  } as React.CSSProperties,

  "soft-success": {
    "--normal-bg":
      "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
    "--normal-text":
      "light-dark(var(--color-green-600), var(--color-green-400))",
    "--normal-border":
      "light-dark(var(--color-green-600), var(--color-green-400))",
  } as React.CSSProperties,

  "soft-warning": {
    "--normal-bg":
      "color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))",
    "--normal-text":
      "light-dark(var(--color-amber-600), var(--color-amber-400))",
    "--normal-border":
      "light-dark(var(--color-amber-600), var(--color-amber-400))",
  } as React.CSSProperties,

  "soft-error": {
    "--normal-bg":
      "color-mix(in oklab, var(--destructive) 10%, var(--background))",
    "--normal-text": "var(--destructive)",
    "--normal-border": "var(--destructive)",
  } as React.CSSProperties,

  "outline-info": {
    "--normal-bg": "var(--background)",
    "--normal-text": "light-dark(var(--color-sky-600), var(--color-sky-400))",
    "--normal-border": "light-dark(var(--color-sky-600), var(--color-sky-400))",
  } as React.CSSProperties,

  "outline-success": {
    "--normal-bg": "var(--background)",
    "--normal-text":
      "light-dark(var(--color-green-600), var(--color-green-400))",
    "--normal-border":
      "light-dark(var(--color-green-600), var(--color-green-400))",
  } as React.CSSProperties,

  "outline-warning": {
    "--normal-bg": "var(--background)",
    "--normal-text":
      "light-dark(var(--color-amber-600), var(--color-amber-400))",
    "--normal-border":
      "light-dark(var(--color-amber-600), var(--color-amber-400))",
  } as React.CSSProperties,

  "outline-error": {
    "--normal-bg": "var(--background)",
    "--normal-text": "var(--destructive)",
    "--normal-border": "var(--destructive)",
  } as React.CSSProperties,

  "solid-info": {
    "--normal-bg": "light-dark(var(--color-sky-600), var(--color-sky-400))",
    "--normal-text": "var(--color-white)",
    "--normal-border": "light-dark(var(--color-sky-600), var(--color-sky-400))",
  } as React.CSSProperties,

  "solid-success": {
    "--normal-bg": "light-dark(var(--color-green-600), var(--color-green-400))",
    "--normal-text": "var(--color-white)",
    "--normal-border":
      "light-dark(var(--color-green-600), var(--color-green-400))",
  } as React.CSSProperties,

  "solid-warning": {
    "--normal-bg": "light-dark(var(--color-amber-600), var(--color-amber-400))",
    "--normal-text": "var(--color-white)",
    "--normal-border":
      "light-dark(var(--color-amber-600), var(--color-amber-400))",
  } as React.CSSProperties,

  "solid-error": {
    "--normal-bg":
      "light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))",
    "--normal-text": "var(--color-white)",
    "--normal-border": "transparent",
  } as React.CSSProperties,
};
