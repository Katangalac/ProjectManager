import { User, SafeUser, CreateUserData, UpdateUserData, SearchUsersFilter } from "../types/User";
import { toSafeUser } from "./user.transforms";
import { EmailAlreadyUsedError, PhoneNumberAlreadyUsedError, UserAlreadyExistError, UserNotFoundError, UsernameAlreadyUsedError } from "../errors/index";
import { Prisma, UserRole, UserProvider } from "@prisma/client";
import { db } from "../../db";
import { hash } from "argon2";
import { Team } from "../../team/types/Team";
import { Project } from "../../project/types/Project";
import { Task } from "../../task/types/Task";


/**
 * Crée et enregistre un nouvel utilisateur dans le système
 * @async
 * @param {CreateUserData} newUserData - les informations nécessaires pour la création d'un utilisateur
 * @param {UserProvider} provider - la source de provenance de l'utilsateur ( ex:google,facebook,local ou autres)
 * @param {string|null} oauthId - identifiant unique de l'utilisateur provenant d'un service 0Auth le cas echéant
 * @returns {SafeUser} - l'utilisateur créé 
 * @throws {EmailAlreadyUsedError} - lorsque l'email est déjà utilisé par un autre utilisateur
 * @throws {UsernameAlreadyUsedError} - lorsque le nom d'utilisateur est déjà utilisé par un autre utilisateur
 * @throws {UserAlreadyExistError} - lorsque l'utilisateur est déjà enregistré dans le système
 */
export const createUser = async (newUserData: CreateUserData, provider: UserProvider = UserProvider.LOCAL, oauthId:string|null = null): Promise<SafeUser> => {
    try {
        let hashedPassword = null;
        if (provider === UserProvider.LOCAL) {
            hashedPassword = await hash(newUserData.password);
        }
        const newUser = await db.user.create({
            data: {
                ...newUserData,
                password: hashedPassword,
                role: UserRole.MEMBER,
                provider: provider,
                oauthId: oauthId
            }
        });
        return toSafeUser(newUser);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("userName")) throw new UsernameAlreadyUsedError();
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("email")) throw new EmailAlreadyUsedError();
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("googleId")) throw new UserAlreadyExistError();
        }
        throw err;
    }
};

/**
 * Fait une recherche des utilisateurs enregistrés en appliquant le filtre transmis
 * @async
 * @param {SearchUsersFilter} filter - les filtres à utiliser sur la liste des utilisateurs
 * @returns {Promise<SafeUser[]>} - la liste des utilisateurs respectant les filtres utilisés
 */
export const getUsers = async (filter: SearchUsersFilter): Promise<SafeUser[]> => {
    const { page, pageSize, ..._ } = filter;
    const where: Prisma.UserWhereInput = {};
    if (filter.email) where.email = { contains: filter.email, mode: 'insensitive' };
    if (filter.userName) where.userName = { contains: filter.userName, mode: 'insensitive' };
    if (filter.firstName) where.firstName = { contains: filter.firstName, mode: 'insensitive' };
    if (filter.lastName) where.lastName = { contains: filter.lastName, mode: 'insensitive' };
    if (filter.profession) where.profession = { contains: filter.profession, mode: 'insensitive' };
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const users = await db.user.findMany({
        where,
        skip,
        take
    });
    return users.map(toSafeUser);
};

/**
 * Fait une recherche de l'utilisateur ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant de l'utilisateur recherché
 * @returns {Promise<SafeUser>} - l'utilisateur ayant l'identifiant passé en paramètre
 * @throws {UserNotFoundError} - lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 */
export const getUserById = async (id: string): Promise<SafeUser> => {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundError(id);
    return toSafeUser(user);
};

/**
 * Met à jour les informations d'un utilisateur
 * @async
 * @param {string} id - l'identifiant de l'utilisateur
 * @param {UpdateUserData} userData - les données à mettre à jour
 * @returns {Promise<SafeUser>} - l'utilisateur avec les informations à jour 
 * @throws {UserNotFoundError} - lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 * @throws {EmailAlreadyUsedError} - lorsque l'email est déjà utilisé par un autre utilisateur
 * @throws {UsernameAlreadyUsedError} - lorsque le nom d'utilisateur est déjà utilisé par un autre utilisateur
 * @throws {PhoneNumberAlreadyUsedError} - lorsque le numéro de téléphone est déjà utilisé par un autre utilisateur
 */
export const updateUser = async (id: string, userData: UpdateUserData): Promise<SafeUser> => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) throw new UserNotFoundError(id);
        const updatedUser = await db.user.update({
            where: { id },
            data: userData as Prisma.UserUpdateInput
        });
        return toSafeUser(updatedUser);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("userName")) throw new UsernameAlreadyUsedError();
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("email")) throw new EmailAlreadyUsedError();
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("phoneNumber")) throw new PhoneNumberAlreadyUsedError();
        }
        throw err;
    }
};

/**
 * Supprime l'utilisateur ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - l'identifiant de l'utilisateur à supprimer
 * @throws {UserNotFoundError} - lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 */
export const deleteUser = async (id: string): Promise<void> => {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundError(id);
    await db.user.delete({ where: { id } });
};

/**
 * Récupère toutes les équipes dont un utilisateur est membre
 * @async
 * @param {string} userId - identifiant de l'utilisateur dont on veut récupérer l'équipe
 * @returns {Team[]} - la liste d'équipes dont l'utilisateur est membre
 */
export const getUserTeams = async (userId: string): Promise<Team[]> => {
    const userTeams = await db.team.findMany({
        where: {
            teamUsers: {
                some: { userId }
            }
        }
    });
    return userTeams;
}

/**
 * Récupère tous les projets dan lesquels l'utilisateur est impliqué
 * @param {string} userId - identifiant de l'utilisateur
 * @returns {Project[]} - la liste de projets dans lesquels l'utilisateur intervient
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
    const userProjects = await db.project.findMany({
        where: {
            projectTeams: {
                some: {
                    team: {
                        teamUsers: {
                            some: { userId }
                        }
                    }
                }
            }
        }
    });
    return userProjects;
}

/**
 * Récupère les taches de l'utilisateur
 * @param {string} userId - identifiant de l'utilisateur
 * @returns {Task[]} - la liste des tâches auxquelles l'utilisateur est assignée
 */
export const getUserTasks = async (userId: string): Promise<Task[]> => {
    const userTasks = await db.task.findMany({
        where: {
            assignedTo: {
                some:{userId}
            }
        }
    });
    return userTasks;
}