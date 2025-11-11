import { Team, CreateTeamData, UserTeam, UpdateTeamData, SearchTeamsFilter } from "./Team";
import { db } from "../db";
import { TeamNotFoundError, UserAlreadyInTeamError, UserNotInTeamError } from "./errors";
import { Prisma } from "@prisma/client";
import { toSafeUser } from "../user/user.transforms";
import { SearchUsersFilter } from "../user/User";
import { ProjectsCollection, SearchProjectsFilter } from "../project/Project";
import { SearchTasksFilter } from "../task/Task";
import { buildTeamWhereInput, buildUserWhereInput, buildProjectWhereInput, buildTaskWhereInput, buildPaginationInfos } from "../utils/utils";
import { TeamsCollection } from "./Team";
import { UsersCollection } from "../user/User";
import { TasksCollection } from "../task/Task";


/**
 * Crée une nouvelle équipe de travail
 * @async
 * @param {CreateTeamData} teamData - informations sur l'équipe à créer
 * @returns {Team} - un objet Team représentant l'équipe créée
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
 * @param {SearchTeamsFilter} filter - le filtre de recherche à utiliser
 * @returns {TeamsCollection} - la liste d'équipes créées dans le système
 */
export const getTeams = async (filter: SearchTeamsFilter): Promise<TeamsCollection> => {
    const { page, pageSize, all, ..._ } = filter;

    //Construction du WHERE à partir des filtres
    const where = buildTeamWhereInput(filter);

    //Compte total d'équipes correspondant au filtre
    const totalItems = await db.team.count({ where });
    
    //Construction de la requête principale
    const query: Prisma.TeamFindManyArgs = {
        where,
        orderBy: { updatedAt: "desc" }
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    //Exécution de la requête
    const teams = await db.team.findMany(query);

    //Calcul pagination
    const pagination = buildPaginationInfos(all, page, pageSize, totalItems);
    
    return {
        teams,
        pagination
    };
};

/**
 * Récupère l'équipe ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - identifiant de l'équipe recherchée
 * @returns {Team} - un objet Team représentant l'équipe ayant l'identifiant spécifié
 * @throws {TeamNotFoundError} - si aucune équipe avec l'identifiant donnée n'a été trouvée
 */
export const getTeamById = async (id: string): Promise<Team> => {
    const team = await db.team.findUnique({ where: { id } });
    if (!team) throw new TeamNotFoundError(id);
    return team;
};

/**
 * Met à jour les informations de Léquipe ayant l'ideneitifiant passé en paramètre
 * @async
 * @param {string} id - identfiant de l'équipe à modifier
 * @param {updateTeamData} teamData - les informations à modifier/mettre à jour
 * @returns {Team} - un objet représentant l'équipe avec les informations à jour
 */
export const updateTeam = async (id: string, teamData: UpdateTeamData): Promise<Team> => {
    try {
        const updatedTeam = await db.team.update({
            where: { id },
            data: teamData as Prisma.TeamUpdateInput
        });
        return updatedTeam;
    } catch (err: any) {
        if (err.code === "P2025") throw new TeamNotFoundError(id);
        throw err;
    }
};

/**
 * Supprime l'équipe ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - identifiant de l'équipe à supprimer
 * @throws {TeamNotFoundError} - si aucune équipe avec l'identifiant donnée n'a été trouvée
 */
export const deleteTeam = async (id: string) => {
    try {
        await db.team.delete({ where: { id } });
    }catch (err: any) {
        if (err.code === "P2025") throw new TeamNotFoundError(id);
        throw err;
    }
};

/**
 * Ajoute un utilisateur dans une équipe
 * @async
 * @param {string} userId - identifiant de l'utilisateur qu'on veut ajouter dans l'équipe
 * @param {string} teamId - identifiant de l'équipe dans laquelle on veut ajouter l'utilisateur
 * @param {string} userRole - rôle de l'utilisateur dans l'équipe
 * @returns {UserTeam} - un objet représentant le lien entre l'utilisateur et l'équipe
 * @throws {UserAlreadyInTeamError} - si l'utilisateur fait déjà partie de l'équipe
 */
export const addUserToTeam = async (userId: string, teamId: string, userRole: string = ""): Promise<UserTeam> => {
    try {
        const userTeamPair = await db.userTeam.create({
            data: {
                userId,
                teamId,
                userRole
            }
        });
        return userTeamPair;
    } catch (err: any) {
        if (err.code === "P2002") throw new UserAlreadyInTeamError(userId, teamId);
        throw err;
    }
};

/**
 * Retire un utilisateur d'une équipe
 * @param {string} userId - identifiant de l'utilisateur qu'on veut retirer de l'équipe
 * @param {string} teamId - identifiant de l'équipe de laquelle on veut retirer l'utilisateur
 * @throws {UserNotInTeamError} - si l'utilisateur ne fait pas partie de l'équipe
 */
export const removeUserFromTeam = async (userId: string, teamId: string) => {
    try {
        await db.userTeam.delete({
            where: {
                pk_user_team: { userId, teamId }
            },
        });
    }catch (err: any) {
        if (err.code === "P2025") throw new UserNotInTeamError(userId, teamId);
        throw err;
    }
};

/**
 * Met à jour le role d'un utilisateur dans une équipe
 * @param userId - identifiant de l'utilisateur 
 * @param teamId - identifiant de l'équipe
 * @param userRole - role de l'utilisateur
 * @returns la version à jour du role de l'utilisateur dans l'équipe
 * @throws {UserNotInTeamError} - si l'utilisateur ne fait pas partie de l'équipe
 */
export const updateUserRoleInTeam = async (userId: string, teamId: string, userRole: string):Promise<UserTeam> => {
    try {
        const updatedUserTeamPair = await db.userTeam.update({
            where: {
                pk_user_team: { userId, teamId }
            },
            data: { userRole: userRole }
        });
        return updatedUserTeamPair;
    } catch (err: any) {
        if (err.code === "P2025") throw new UserNotInTeamError(userId, teamId);
        throw err;
    }
};

/**
 * Récupère les membres d'une équipe
 * @async
 * @param {string} teamId - identifiant de l'équipe dont on veux récupérer les membres
 * @param {SearchUsersFilter} filter - filtre de recherche à utiliser
 * @returns {UsersCollection} - la liste des utilisateurs membres de l'équipe
 */
export const getTeamMembers = async (teamId: string, filter:SearchUsersFilter): Promise<UsersCollection> => {
    const { page, pageSize,all, ..._ } = filter;
    const teamMemberCondition: Prisma.UserWhereInput = {
        userTeams: {
            some: { teamId }
        }
    };

    //Construction du WHERE à partir des filtres
    const userFilter = buildUserWhereInput(filter);

    //Compte total d'utilisateur correspondant au filtre
    const totalItems = await db.user.count({
        where: {
            AND:[teamMemberCondition, userFilter]
    } });

    //Construction de la requête principale
    const query: Prisma.UserFindManyArgs = {
        where: {
            AND:[teamMemberCondition, userFilter]
        },
        orderBy:{updatedAt:"desc"}
    };
    
    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    //Exécution de la requête
    const users = await db.user.findMany(query);
    const teamMembers = users.map(toSafeUser);

    //Calcul pagination
    const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

    return {
        users: teamMembers,
        pagination
    };
};

/**
 * Récupère tous les projets dans lesquels une équipe intervient
 * @param teamId - identifiant de l'équipe
 * @param {SearchProjectsFilter} filter - filtre de recherche à utiliser
 * @returns {ProjectsCollection} - la liste de projets dans lesquels l'équipe est impliquée
 */
export const getTeamProjects = async (teamId: string, filter: SearchProjectsFilter): Promise<ProjectsCollection> => {
    const { page, pageSize,all, ..._ } = filter;
    const teamProjectCondition: Prisma.ProjectWhereInput = {
        projectTeams: {
            some: { teamId }
        }
    };

    //Construction du WHERE à partir des filtres
    const projectFilter = buildProjectWhereInput(filter);

    //Compte total des projets correspondant au filtre
    const totalItems = await db.project.count({
        where: {
            AND:[teamProjectCondition, projectFilter]
    }});

    //Construction de la requête principale
    const query: Prisma.ProjectFindManyArgs = {
        where: {
            AND:[teamProjectCondition, projectFilter]
        },
        orderBy:{deadline:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    //Exécution de la requête
    const teamProjects = await db.project.findMany(query);

    //Calcul pagination
    const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

    return {
        projects: teamProjects,
        pagination
    };
};

/**
 * Récupère toutes les taches assignées à une équipe
 * @param teamId - identifiant de l'équipe
 * @param {SearchTasksFilter} filter - filtre de recherche à utiliser
 * @returns {TasksCollection} - la liste de taches dans lesquelles l'équipe est impliquée
 */
export const getTeamTasks = async (teamId: string, filter: SearchTasksFilter): Promise<TasksCollection> => {
    const { page, pageSize,all, ..._ } = filter;
    
    //Construction du WHERE à partir des filtres
    const taskFilter = buildTaskWhereInput(filter);

    //Compte total des tâches correspondant au filtre
    const totalItems = await db.task.count({
        where: {
            AND:[{teamId}, taskFilter]
    }});

    //Construction de la requête principale
    const query: Prisma.TaskFindManyArgs = {
        where: {
            AND:[{teamId}, taskFilter]
        },
        orderBy:{deadline:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    //Exécution de la requête
    const teamTasks = await db.task.findMany(query);

    //Calcul pagination
    const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

    return {
        tasks: teamTasks,
        pagination
    };
};