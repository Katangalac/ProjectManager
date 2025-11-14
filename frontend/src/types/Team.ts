import type { Pagination } from "./Pagination";

export type Team = {
    id: string;
    leaderId: string | null;
    name: string;
    description: string;
    updatedAt: Date;
    createdAt: Date;
};

export type CreateTeamData = {
    leaderId: string | null;
    name: string;
    description: string;
};

export type UpdateTeamData = {
    leaderId?: string | null | undefined;
    name?: string | undefined;
    description?: string | undefined;
};

export type TeamsCollection = {
    teams: Team[];
    pagination: Pagination
};

export type SearchTeamsFilter = {
    page: number;
    pageSize: number;
    name?: string | undefined;
    all?: boolean | undefined;
};

export type UserTeam = {
    userId: string;
    teamId: string;
    userRole: string;
    createdAt: Date;
    updatedAt: Date;
};