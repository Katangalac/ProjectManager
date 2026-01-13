import { axiosClient } from "@/lib/axios/axiosClient";
import { showInfo } from "@/utils/toastService";
import { emailSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { InputText } from "../ui/InputText";
import { Mail } from "lucide-react";

type ForgetPassordFormProps = {
  onSuccess: () => void;
};

/**
 * Formulaire d'oublie de mot de passe
 */
export default function ForgotPasswordForm({
  onSuccess,
}: ForgetPassordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await axiosClient.post("/auth/forgot-password", data);
      showInfo("If this email exists, a reset link has been sent.", 15000);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={clsx("flex flex-col gap-3.5")}
      >
        <div className={clsx("flex w-full flex-col gap-1")}>
          <div>
            <InputText
              icon={<Mail className="size-6 stroke-[1.25px]" />}
              placeholder="Email"
              iconPosition="right"
              error={errors.email?.message}
              {...register("email")}
              className="border-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className={clsx(
            "mt-2 w-full p-2 text-center font-semibold text-white",
            "rounded-sm bg-sky-500 hover:bg-sky-600"
          )}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
