export type LoginData = {
    identifier: string;
    password: string;
};

export type updatePasswordData = {
    currentPassword: string;
    newPassword: string;
};

export type AuthFormType = "LOGIN" | "REGISTER";

export type AuthFormProps = {
  type: AuthFormType;
};