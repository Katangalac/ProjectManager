import { clsx } from "clsx";
import { InputText } from "./InputText";
import { useState, forwardRef } from "react";

interface InputPasswordProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
  className?: string;
  iconPosition?: "left" | "right";
  label?: string;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <InputText
        ref={ref}
        type={showPassword ? "text" : "password"}
        onIconClick={() => setShowPassword(!showPassword)}
        icon={
          <i
            className={clsx(
              "size-4",
              showPassword ? "pi pi-eye-slash" : "pi pi-eye"
            )}
          />
        }
        {...props}
      />
    );
  }
);

InputPassword.displayName = "InputPassword";
