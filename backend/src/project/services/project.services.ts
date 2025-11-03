import { CreateProjectData, SearchProjectsFilter, Project, UpdateProjectData } from "../types/Project";
import { ProjectNotFoundError, TeamAlreadyInProjectError, TeamNotInProjectError } from "../errors";
import { db } from "../../db";
import { Prisma, ProjectTeam } from "@prisma/client";
import { Team } from "../../team/types/Team";
import { toSafeUser } from "../../user/services/user.transforms";
import { SafeUser } from "../../user/types/User";
import { Task } from "../../task/types/Task";

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
    const { page, pageSize, ..._} = filter;
    const where: Prisma.ProjectWhereInput = {};
    if (filter.title) where.title = { contains: filter.title, mode: 'insensitive' };
    if (filter.status) where.status = filter.status;
    if (filter.startOn) where.startedAt = { equals: new Date(filter.startOn) }
    if (filter.startBefore) where.startedAt = { lt: new Date(filter.startBefore) }
    if (filter.startAfter) where.startedAt = { gt: new Date(filter.startAfter) }
    if (filter.endOn) where.deadline = { equals: new Date(filter.endOn) }
    if (filter.endBefore) where.deadline = { lt: new Date(filter.endBefore) }
    if (filter.endAfter) where.deadline = { gt: new Date(filter.endAfter) }
    if (filter.completedOn) where.completedAt = { equals: new Date(filter.completedOn) }
    if (filter.completedBefore) where.completedAt = { lt: new Date(filter.completedBefore) }
    if (filter.completedAfter) where.completedAt = { gt: new Date(filter.completedAfter) }
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const projects = await db.project.findMany({
        where,
        skip,
        take
    });
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
    const project = await db.project.findUnique({ where: { id } });
    if (!project) throw new ProjectNotFoundError(id);
    const updatedProject = await db.project.update({
        where: { id },
        data: projectData as Prisma.ProjectUpdateInput
    });
    return updatedProject;
};

/**
 * Supprime le projet ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant du projet à supprime
 * @throws {ProjectNotFoundError} - lorsqu'aucun projet avec l'identifiant donné n'a été trouvé
 */
export const deleteProject = async (id: string) => {
    const project = await db.project.findUnique({ where: { id } });
    if (!project) throw new ProjectNotFoundError(id);
    await db.project.delete({ where: { id } });
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
    let projectTeamPair = await db.projectTeam.findUnique({
        where: {
            pk_project_team: { projectId: projectId, teamId: teamId }
        }
    });
    if (projectTeamPair) throw new TeamAlreadyInProjectError(teamId, projectId);

    projectTeamPair = await db.projectTeam.create({
        data: {
            projectId: projectId,
            teamId: teamId
        }
    });
    return projectTeamPair;
};

/**
 * Retire une équipe d'un projet
 * @async
 * @param {string} teamId - identifiant de l'équipe à retirer du projet
 * @param {string} projectId - identifiant du projet
 * @throws {TeamNotInProjectError} - lorsque l'équipe n'est pas dans le projet
 */
export const removeTeamFromProject = async (teamId: string, projectId: string) => {
    const projectTeamPair = await db.projectTeam.findUnique({
        where: {
            pk_project_team: { projectId: projectId, teamId: teamId }
        }
    });
    if (!projectTeamPair) throw new TeamNotInProjectError(teamId, projectId);

    await db.projectTeam.delete({
        where: {
            pk_project_team: { projectId: projectId, teamId: teamId }
        }
    });
};

/**
 * Récupère toutes les équipes impliquées dans un projet
 * @async
 * @param projectId - identifiant du projet
 * @returns {Team[]} - la liste d'équipes intervenant dans le projet
 */
export const getProjectTeams = async (projectId: string): Promise<Team[]> => {
    const projectTeams = await db.team.findMany({
        where: {
            teamProjects: {
                some: { projectId }
            }
        }
    });
    return projectTeams;
};

/**
 * Récupère tous les utilisateurs impliqués dans un projet
 * @param projectId - identifiant du projet
 * @returns {SafeUser[]} - les utilisateurs intervenant dans le projet
 */
export const getProjectMembers = async (projectId: string): Promise<SafeUser[]> => {
    const projectUsers = await db.user.findMany({
        where: {
            userTeams: {
                some: {
                    team: {
                        teamProjects: {
                            some: { projectId }
                        }
                    }
                }
            }
        }
    });
    const projectSafeUsers = projectUsers.map(toSafeUser);
    return projectSafeUsers;
};

/**
 * Récupère toutes les taches d'un projet
 * @param projectId - identifiant du projet
 * @returns {Task[]} - la liste de taches du projet
 */
export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
    const project = await db.project.findUnique({ 
        where: { id: projectId },
        include: {
            projectTasks : true
        }
    });
    if (!project) throw new ProjectNotFoundError(projectId);
    return project.projectTasks;
}
