import { Team, CreateTeamData, UserTeam, UpdateTeamData } from "../types/Team";
import { db } from "../../db";
import { TeamNotFoundError, UserAlreadyInTeamError, UserNotInTeamError } from "../errors";
import { Prisma } from "@prisma/client";
import { toSafeUser } from "../../user/services/user.transforms";
import { SafeUser } from "../../user/types/User";
import { Project } from "../../project/types/Project";

/**
 * Crée une nouvelle équipe de travail
 * @async
 * @param {CreateTeamData} teamData : informatons sur l'équipe à créer
 * @returns {Team} : un objet Team représentant l'équipe créée
 */
export const createTeam = async (teamData: CreateTeamData): Promise<Team> => {
    const newTeam = await db.team.create({
        data: teamData
    });
    return newTeam;
};

/**
 * Récupère la liste des équipes enregitrées dans le système
 * @async
 * @returns {Team[]}  la liste d'équipes créées dans le système
 */
export const getTeams = async (): Promise<Team[]> => {
    const teams = await db.team.findMany();
    return teams;
};

/**
 * Récupère l'équipe ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id : identifiant de l'équipe recherchée
 * @returns {Team} : un objet Team représentant l'équipe ayant l'identifiant spécifié
 * @throws {TeamNotFoundError} : si aucune équipe avec l'identifiant donnée n'a été trouvée
 */
export const getTeamById = async (id: string): Promise<Team> => {
    const team = await db.team.findUnique({ where: { id } });
    if (!team) throw new TeamNotFoundError(id);
    return team;
};

/**
 * Met à jour les informations de Léquipe ayant l'ideneitifiant passé en paramètre
 * @async
 * @param {string} id : identfiant de l'équipe à modifier
 * @param {updateTeamData} teamData : les informations à modifier/mettre à jour
 * @returns {Team}: un objet représentant l'équipe avec les informations à jour
 */
export const updateTeam = async (id: string, teamData: UpdateTeamData): Promise<Team> => {
    const team = await db.team.findUnique({ where: { id } });
    if (!team) throw new TeamNotFoundError(id);
    const updatedTeam = await db.team.update({
        where: { id },
        data: teamData as Prisma.TeamUpdateInput
    });
    return updatedTeam;
};

/**
 * Supprime l'équipe ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id : identifiant de l'équipe à supprimer
 * @throws {TeamNotFoundError} : si aucune équipe avec l'identifiant donnée n'a été trouvée
 */
export const deleteTeam = async (id: string) => {
    const team = await db.team.findUnique({ where: { id } });
    if (!team) throw new TeamNotFoundError(id);
    await db.team.delete({ where: { id } });
};

/**
 * Ajoute un utilisateur dans une équipe
 * @async
 * @param {string} userId : identifiant de l'utilisateur qu'on veut ajouter dans l'équipe
 * @param {string} teamId : identifiant de l'équipe dans laquelle on veut ajouter l'utilisateur
 * @param {string} userTeamRole : rôle de l'utilisateur dans l'équipe
 * @returns {UserTeam} : un objet représentant le lien entre l'utilisateur et l'équipe
 * @throws {UserAlreadyInTeamError} : si l'utilisateur fait déjà partie de l'équipe
 */
export const addUserToTeam = async (userId: string, teamId: string, userTeamRole: string = ""): Promise<UserTeam> => {
    let userTeamPair = await db.userTeam.findUnique({
        where: {
            pk_user_team: { userId: userId, teamId: teamId }
        },
    });
    if (userTeamPair) throw new UserAlreadyInTeamError(userId, teamId);
    userTeamPair = await db.userTeam.create({
        data: {
            userId: userId,
            teamId: teamId,
            userRole: userTeamRole
        }
    });
    return userTeamPair;
};

/**
 * Retire un utilisateur d'une équipe
 * @param {string} userId : identifiant de l'utilisateur qu'on veut retirer de l'équipe
 * @param {string} teamId : identifiant de l'équipe de laquelle on veut retirer l'utilisateur
 * @throws {UserNotInTeamError} : si l'utilisateur ne fait pas partie de l'équipe
 */
export const removeUserFromTeam = async (userId: string, teamId: string) => {
    let userTeamPair = await db.userTeam.findUnique({
        where: {
            pk_user_team: { userId: userId, teamId: teamId }
        },
    });
    if (!userTeamPair) throw new UserNotInTeamError(userId, teamId);

    await db.userTeam.delete({
        where: {
            pk_user_team: { userId: userId, teamId: teamId }
        },
    });
};

/**
 * Met à jour le role d'un utilisateur dans une équipe
 * @param userId : identifiant de l'utilisateur 
 * @param teamId : identifiant de l'équipe
 * @param userTeamRole : role de l'utilisateur
 * @returns la version à jour du role de l'utilisateur dans l'équipe
 * @throws {UserNotInTeamError} : si l'utilisateur ne fait pas partie de l'équipe
 */
export const updateUserRoleInTeam = async (userId: string, teamId: string, userTeamRole: string):Promise<UserTeam> => {
    let userTeamPair = await db.userTeam.findUnique({
        where: {
            pk_user_team: { userId: userId, teamId: teamId }
        },
    });
    if (!userTeamPair) throw new UserNotInTeamError(userId, teamId);
    const updatedUserTeamPair = await db.userTeam.update({
        where: {
            pk_user_team: { userId: userId, teamId: teamId }
        },
        data: { userRole: userTeamRole }
    });
    return updatedUserTeamPair;
};

/**
 * Récupère les membres d'une équipe
 * @async
 * @param {string} teamId : identifiant de l'équipe dont on veux récupérer les membres
 * @returns {SafeUser[]} : la liste des utilisateurs membres de l'équipe
 */
export const getTeamMembers = async (teamId: string): Promise<SafeUser[]> => {
    const users = await db.user.findMany({
        where: {
            userTeams: {
                some: { teamId }
            }
        }
    });
    const teamMembers = users.map(toSafeUser);
    return teamMembers;
};

/**
 * Récupère tous les projets dans lesquels une équipe intervient
 * @param teamId : identifiant de l'équipe
 * @returns {Project[]} : la liste de projets dans lesquels l'équipe est impliquée
 */
export const getTeamProjects = async (teamId: string): Promise<Project[]> => {
    const teamProjects = await db.project.findMany({
        where: {
            projectTeams: {
                some: { teamId }
            }
        }
    });
    return teamProjects;
};