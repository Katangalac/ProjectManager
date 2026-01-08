import { toast } from "sonner";
import { clsx } from "clsx";
import UserErrorMessage from "@/components/commons/UserErrorMessage";

export default function TestPage() {
  return (
    <div className={clsx("flex min-h-screen items-center justify-center")}>
      <UserErrorMessage
        onRetryButtonClick={() =>
          toast.success("Retry!", {
            style: {
              "--normal-bg":
                "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
              "--normal-text":
                "light-dark(var(--color-green-600), var(--color-green-400))",
              "--normal-border":
                "light-dark(var(--color-green-600), var(--color-green-400))",
            } as React.CSSProperties,
          })
        }
      />
      <button
        className="rounded-sm bg-sky-500 px-4 py-2 font-bold text-white"
        onClick={() =>
          toast.success("Event has been created", {
            style: {
              "--normal-bg":
                "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
              "--normal-text":
                "light-dark(var(--color-green-600), var(--color-green-400))",
              "--normal-border":
                "light-dark(var(--color-green-600), var(--color-green-400))",
            } as React.CSSProperties,
          })
        }
      >
        Show sonner
      </button>
    </div>
  );
}
