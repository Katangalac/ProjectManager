import { InputText } from "./InputText";
import { useState, forwardRef } from "react";
import { Eye, EyeClosed } from "lucide-react";

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
          showPassword ? (
            <Eye className="size-6 stroke-[1.25px]" />
          ) : (
            <EyeClosed className="size-6 stroke-[1.25px]" />
          )
        }
        {...props}
      />
    );
  }
);

InputPassword.displayName = "InputPassword";
