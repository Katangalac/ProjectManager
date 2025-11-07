import { CreateProjectData, SearchProjectsFilter, Project, UpdateProjectData } from "../types/Project";
import { ProjectNotFoundError, TeamAlreadyInProjectError, TeamNotInProjectError } from "../errors";
import { db } from "../../db";
import { Prisma, ProjectTeam } from "@prisma/client";
import { Team } from "../../team/types/Team";
import { toSafeUser } from "../../user/services/user.transforms";
import { SafeUser } from "../../user/types/User";
import { Task } from "../../task/types/Task";
import { buildProjectWhereInput } from "../../utils/utils";
import { buildUserWhereInput } from "../../utils/utils";
import { buildTaskWhereInput } from "../../utils/utils";
import { buildTeamWhereInput } from "../../utils/utils";
import { SearchTasksFilter } from "../../task/types/Task";
import { SearchUsersFilter } from "../../user/types/User";
import { SearchTeamsFilter } from "../../team/types/Team";

/**
 * Crée un nouveau projet 
 * @async
 * @param {CreateProjectData} projectData - informations sur le projet
 * @returns {Project} - un objet représentant le projet créé
 */
export const createProject = async (projectData: CreateProjectData): Promise<Project> => {
    const project = await db.project.create({
        data: projectData
    });
    return project;
};

/**
 * Récupère le projet ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant du projet à récupérer
 * @returns {Project} - le projet ayant l'identifiant passé en paramètre
 * @throws {ProjectNotFoundError} - lorsqu'aucun projet avec l'identifiant donné n'a été trouvé
 */
export const getProjectById = async (id: string):Promise<Project> => {
    const project = await db.project.findUnique({ where: { id } });
    if (!project) throw new ProjectNotFoundError(id);
    return project;
};

/**
 * Récupère les projets remplissant les critères de filtre passé en paramètre
 * @async
 * @param {SearchProjectsFilter} - les filtres de recherche à utiliser 
 * @returns {Project[]} - la liste de projets remplissant les critères de recherche
 */
export const getProjects = async (filter: SearchProjectsFilter): Promise<Project[]> => {
    const { page, pageSize,all, ..._} = filter;
    const where = buildProjectWhereInput(filter);
    const query: Prisma.ProjectFindManyArgs = {
        where,
        orderBy:{updatedAt:"desc"}
    };
    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }
    const projects = await db.project.findMany(query);
    return projects;
};

/**
 * Met à jour les informations d'un projet
 * @async 
 * @returns {Project} - le projet ayant l'identifiant passé en paramètre
 * @param {UpdateProjectData} projectData - les nouvelles informations du projet
 * @throws {ProjectNotFoundError} - lorsqu'aucun projet avec l'identifiant donné n'a été trouvé
 */
export const updateProject = async (id: string, projectData: UpdateProjectData): Promise<Project> => {
    try {
        const updatedProject = await db.project.update({
            where: { id },
            data: projectData as Prisma.ProjectUpdateInput
        });
        return updatedProject;
    } catch (err: any) {
        if (err.code === "P2025") throw new ProjectNotFoundError(id);
        throw err;
    }
};

/**
 * Supprime le projet ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant du projet à supprime
 * @throws {ProjectNotFoundError} - lorsqu'aucun projet avec l'identifiant donné n'a été trouvé
 */
export const deleteProject = async (id: string) => {
    try {
        await db.project.delete({ where: { id } });
    }catch (err: any) {
        if (err.code === "P2025") throw new ProjectNotFoundError(id);
        throw err;
    }
};

/**
 * Ajoute une équipe dans un projet
 * @async
 * @param {string} teamId - identifiant de l'équipe à ajouter dans le projet
 * @param {string} projectId - identifiant du projet
 * @returns {ProjectTeam} - un objet représentant le lien créé entre l'équipe et le projet
 * @throws {TeamAlreadyInProjectError} - lorsque l'équipe est déjà dans le projet
 */
export const addTeamToProject = async (teamId: string, projectId: string):Promise<ProjectTeam> => {
    try {
        const projectTeamPair = await db.projectTeam.create({
            data: {
                projectId: projectId,
                teamId: teamId
            }
        });
        return projectTeamPair;
    } catch (err: any) {
        if (err.code === "P2002") throw new TeamAlreadyInProjectError(teamId, projectId);
        throw err;
    }
};

/**
 * Retire une équipe d'un projet
 * @async
 * @param {string} teamId - identifiant de l'équipe à retirer du projet
 * @param {string} projectId - identifiant du projet
 * @throws {TeamNotInProjectError} - lorsque l'équipe n'est pas dans le projet
 */
export const removeTeamFromProject = async (teamId: string, projectId: string) => {
    try {
        await db.projectTeam.delete({
            where: {
                pk_project_team: { projectId: projectId, teamId: teamId }
            }
        });
    }catch (err: any) {
        if (err.code === "P2025") throw new TeamNotInProjectError(teamId, projectId);
        throw err;
    }
};

/**
 * Récupère toutes les équipes impliquées dans un projet
 * @async
 * @param projectId - identifiant du projet
 * @param {SearchTeamssFilter} filter - filtre de recherche à utiliser
 * @returns {Team[]} - la liste d'équipes intervenant dans le projet
 */
export const getProjectTeams = async (projectId: string, filter: SearchTeamsFilter): Promise<Team[]> => {
    const { page, pageSize,all, ..._ } = filter;
    const projectTeamCondition: Prisma.TeamWhereInput = {
        teamProjects: {
            some: { projectId }
        }
    };

    const teamFilter = buildTeamWhereInput(filter);

    const query: Prisma.TeamFindManyArgs = {
        where: {
            AND:[projectTeamCondition, teamFilter]
        },
        orderBy:{updatedAt:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const projectTeams = await db.team.findMany(query);
    return projectTeams;
};

/**
 * Récupère tous les utilisateurs impliqués dans un projet
 * @param projectId - identifiant du projet
 * @param {SearchUsersFilter} - filtre de recherche à utiliser
 * @returns {SafeUser[]} - les utilisateurs intervenant dans le projet
 */
export const getProjectMembers = async (projectId: string, filter: SearchUsersFilter): Promise<SafeUser[]> => {
    const { page, pageSize,all, ..._ } = filter;
    const projectMemberCondition: Prisma.UserWhereInput = {
        userTeams: {
            some: {
                team: {
                    teamProjects: {
                        some: { projectId }
                    }
                }
            }
        }
    };

    const userFilter = buildUserWhereInput(filter);

    const query: Prisma.UserFindManyArgs = {
        where: {
            AND:[projectMemberCondition, userFilter]
        },
        orderBy:{updatedAt:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const projectUsers = await db.user.findMany(query);

    const projectSafeUsers = projectUsers.map(toSafeUser);
    return projectSafeUsers;
};

/**
 * Récupère toutes les taches d'un projet
 * @param projectId - identifiant du projet
 * @param {SearchTasksFilter} filter - filtre de recherche à utiliser
 * @returns {Task[]} - la liste de taches du projet
 */
export const getProjectTasks = async (projectId: string, filter: SearchTasksFilter): Promise<Task[]> => {
    const { page, pageSize,all, ..._ } = filter;
    
    const taskfilter = buildTaskWhereInput(filter);
        
    const query: Prisma.TaskFindManyArgs = {
        where: {
            AND: [{projectId}, taskfilter]
        },
        orderBy: { deadline: "desc" }
    }

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const projectTasks = await db.task.findMany(query);
    return projectTasks;
};
