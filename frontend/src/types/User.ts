import type { Pagination } from "./Pagination";

export type User = {
    id: string;
    userName: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    profession: string | null;
    imageUrl: string | null;
    role: "ADMIN" | "MEMBER" | "VIEWER" | "USER";
    provider: "LOCAL" | "GOOGLE";
    oauthId: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UserCollection = {
    users: User[];
    pagination: Pagination;
};

export type CreateUserData = {
    userName: string;
    email: string;
    password: string | null;
};

export type UpdateUserData = {
    userName?: string | undefined;
    email?: string | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    phoneNumber?: string | null | undefined;
    profession?: string | null | undefined;
    imageUrl?: string | null | undefined;
};

export type SearchUsersFilter = {
    page: number;
    pageSize: number;
    email?: string | undefined;
    userName?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    profession?: string | undefined;
    all?: boolean | undefined;
};

