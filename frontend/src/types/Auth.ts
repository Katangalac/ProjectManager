import {loginSchema, registerSchema} from "../schemas/auth.schemas.ts";
import {z} from "zod";

export type LoginInputs = z.infer<typeof loginSchema>;

export type RegisterInputs = z.infer<typeof registerSchema>;

export type updatePasswordData = {
    currentPassword: string;
    newPassword: string;
};

export type AuthFormType = "LOGIN" | "REGISTER";

export type AuthFormProps = {
  type: AuthFormType;
};