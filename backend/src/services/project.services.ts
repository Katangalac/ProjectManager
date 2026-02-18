import {
  CreateProjectData,
  SearchProjectsFilter,
  Project,
  UpdateProjectData,
  ProjectsCollection,
} from "@/types/Project";
import {
  ProjectNotFoundError,
  TeamAlreadyInProjectError,
  TeamNotInProjectError,
} from "@/errors/project";
import { db } from "@/db";
import { Prisma, ProjectTeam } from "@prisma/client";
import { SearchTeamsFilter, TeamsCollection } from "@/types/Team";
import { toSafeUser } from "@/services/user.transforms";
import { SearchUsersFilter, UsersCollection } from "@/types/User";
import { SearchTasksFilter, TasksCollection } from "@/types/Task";
import {
  buildProjectWhereInput,
  buildUserWhereInput,
  buildTaskWhereInput,
  buildTeamWhereInput,
  buildPaginationInfos,
} from "@/utils/utils";

/**
 * Crée un nouveau projet
 * @async
 * @param {CreateProjectData} projectData - informations sur le projet
 * @returns {Project} - un objet représentant le projet créé
 */
export const createProject = async (
  projectData: CreateProjectData,
): Promise<Project> => {
  const project = await db.project.create({
    data: projectData,
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
export const getProjectById = async (id: string): Promise<Project> => {
  const project = await db.project.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!project) throw new ProjectNotFoundError(id);
  return project;
};

/**
 * Récupère les projets remplissant les critères de filtre passé en paramètre
 * @async
 * @param {SearchProjectsFilter} - les filtres de recherche à utiliser
 * @returns {ProjectsCollection} - la liste de projets remplissant les critères de recherche
 */
export const getProjects = async (
  filter: SearchProjectsFilter,
): Promise<ProjectsCollection> => {
  const { page, pageSize, all, ..._ } = filter;

  //Construction du WHERE à partir des filtres
  const where = buildProjectWhereInput(filter);

  //Compte total des projets correspondant au filtre
  const totalItems = await db.project.count({ where });

  //Construction de la requête principale
  const query: Prisma.ProjectFindManyArgs = {
    where,
    orderBy: { updatedAt: "desc" },
  };
  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const projects = await db.project.findMany(query);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    projects,
    pagination,
  };
};

/**
 * Calcul le cout total d'un projet
 * @param {string} id - identifiant du projet
 * @returns le cout total du projet
 */
export const getProjectTotalCost = async (id: string): Promise<number> => {
  const result = await db.task.aggregate({
    where: { projectId: id },
    _sum: { cost: true },
  });

  return result._sum.cost ?? 0;
};

/**
 * Met à jour les informations d'un projet
 * @async
 * @returns {Project} - le projet ayant l'identifiant passé en paramètre
 * @param {UpdateProjectData} projectData - les nouvelles informations du projet
 * @throws {ProjectNotFoundError} - lorsqu'aucun projet avec l'identifiant donné n'a été trouvé
 */
export const updateProject = async (
  id: string,
  projectData: UpdateProjectData,
): Promise<Project> => {
  try {
    const updatedProject = await db.project.update({
      where: { id },
      data: projectData as Prisma.ProjectUpdateInput,
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
  } catch (err: any) {
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
export const addTeamToProject = async (
  teamId: string,
  projectId: string,
): Promise<ProjectTeam> => {
  try {
    const projectTeamPair = await db.projectTeam.create({
      data: {
        projectId: projectId,
        teamId: teamId,
      },
    });
    return projectTeamPair;
  } catch (err: any) {
    if (err.code === "P2002")
      throw new TeamAlreadyInProjectError(teamId, projectId);
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
export const removeTeamFromProject = async (
  teamId: string,
  projectId: string,
) => {
  try {
    await db.projectTeam.delete({
      where: {
        pk_project_team: { projectId: projectId, teamId: teamId },
      },
    });
  } catch (err: any) {
    if (err.code === "P2025")
      throw new TeamNotInProjectError(teamId, projectId);
    throw err;
  }
};

/**
 * Récupère toutes les équipes impliquées dans un projet
 * @async
 * @param projectId - identifiant du projet
 * @param {SearchTeamssFilter} filter - filtre de recherche à utiliser
 * @returns {TeamsCollection} - la liste d'équipes intervenant dans le projet
 */
export const getProjectTeams = async (
  projectId: string,
  filter: SearchTeamsFilter,
): Promise<TeamsCollection> => {
  const { page, pageSize, all, ..._ } = filter;
  const projectTeamCondition: Prisma.TeamWhereInput = {
    teamProjects: {
      some: { projectId },
    },
  };

  //Construction du WHERE à partir des filtres
  const teamFilter = buildTeamWhereInput(filter);

  //Compte total d'équipes correspondant au filtre
  const totalItems = await db.team.count({
    where: {
      AND: [projectTeamCondition, teamFilter],
    },
  });

  //Construction de la requête principale
  const query: Prisma.TeamFindManyArgs = {
    where: {
      AND: [projectTeamCondition, teamFilter],
    },
    include: {
      teamUsers: {
        include: {
          user: true,
        },
      },
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const projectTeams = await db.team.findMany(query);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    teams: projectTeams,
    pagination,
  };
};

/**
 * Récupère tous les utilisateurs impliqués dans un projet
 * @param projectId - identifiant du projet
 * @param {SearchUsersFilter} - filtre de recherche à utiliser
 * @returns {UsersCollection} - les utilisateurs intervenant dans le projet
 */
export const getProjectCollaborators = async (
  projectId: string,
  filter: SearchUsersFilter,
): Promise<UsersCollection> => {
  const { page, pageSize, all, ..._ } = filter;
  const projectMemberCondition: Prisma.UserWhereInput = {
    userTeams: {
      some: {
        team: {
          teamProjects: {
            some: { projectId },
          },
        },
      },
    },
  };

  //Construction du WHERE à partir des filtres
  const userFilter = buildUserWhereInput(filter);

  //Compte total d'utilisateur correspondant au filtre
  const totalItems = await db.user.count({
    where: {
      AND: [projectMemberCondition, userFilter],
    },
  });

  //Construction de la requête principale
  const query: Prisma.UserFindManyArgs = {
    where: {
      AND: [projectMemberCondition, userFilter],
    },
    orderBy: { updatedAt: "desc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const projectUsers = await db.user.findMany(query);
  const projectSafeUsers = projectUsers.map(toSafeUser);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    users: projectSafeUsers,
    pagination,
  };
};

/**
 * Récupère toutes les taches d'un projet
 * @param projectId - identifiant du projet
 * @param {SearchTasksFilter} filter - filtre de recherche à utiliser
 * @returns {TasksCollection} - la liste de taches du projet
 */
export const getProjectTasks = async (
  projectId: string,
  filter: SearchTasksFilter,
): Promise<TasksCollection> => {
  const { page, pageSize, all, ..._ } = filter;

  //Construction du WHERE à partir des filtres
  const taskfilter = buildTaskWhereInput(filter);

  //Compte total des tâches correspondant au filtre
  const totalItems = await db.task.count({
    where: {
      AND: [{ projectId }, taskfilter],
    },
  });

  //Construction de la requête principale
  const query: Prisma.TaskFindManyArgs = {
    where: {
      AND: [{ projectId }, taskfilter],
    },
    include: {
      team: true,
      project: true,
      user: true,
      assignedTo: { include: { user: true } },
    },
    orderBy: { deadline: "asc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const projectTasks = await db.task.findMany(query);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    tasks: projectTasks,
    pagination,
  };
};
