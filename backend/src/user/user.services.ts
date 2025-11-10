import { User, SafeUser, CreateUserData, UpdateUserData, SearchUsersFilter } from "./User";
import { toSafeUser } from "./user.transforms";
import { EmailAlreadyUsedError, PhoneNumberAlreadyUsedError, UserAlreadyExistError, UserNotFoundError, UsernameAlreadyUsedError } from "./errors/index";
import { Prisma, UserRole, UserProvider } from "@prisma/client";
import { db } from "../db";
import { hash } from "argon2";
import { Team, SearchTeamsFilter } from "../team/Team";
import { Project, SearchProjectsFilter } from "../project/Project";
import { SearchTasksFilter, Task } from "../task/Task";
import { Notification, SearchNotificationsFilter } from "../notification/Notification";
import { Message, SearchMessagesFilter } from "../message/Message";
import { Conversation, SearchConversationsFilter } from "../conversation/Conversation";
import { buildTaskWhereInput, buildTeamWhereInput, buildProjectWhereInput, buildUserWhereInput, buildNotificationWhereInput,  buildMessageWhereInput, buildConversationWhereInput} from "../utils/utils";

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
            if (!newUserData.password) throw new Error("Le mot de passe doit être fourni pour créer un utilisateur local");
            hashedPassword = await hash(newUserData.password);
        }
        const newUser = await db.user.create({
            data: {
                ...newUserData,
                password: hashedPassword,
                role: UserRole.USER,
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
    const { page, pageSize,all, ..._ } = filter;
    const where = buildUserWhereInput(filter);
    const query: Prisma.UserFindManyArgs = {
        where,
        orderBy:{updatedAt:"desc"}
    }
    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }
    const users = await db.user.findMany(query);
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
 * Fait une recherche de l'utilisateur ayant l'email passé en paramètre
 * @async
 * @param {string} email - l'email de l'utilisateur recherché
 * @returns {Promise<SafeUser|null>} - l'utilisateur ayant l'email passé en paramètre
 * @throws {UserNotFoundError} - lorsqu'aucun utilisateur avec l'email n'est trouvé
 */
export const getUserByEmail = async (email: string): Promise<SafeUser|null> => {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return null;
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
        const updatedUser = await db.user.update({
            where: { id },
            data: userData as Prisma.UserUpdateInput
        });
        return toSafeUser(updatedUser);
    } catch (err:any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("userName")) throw new UsernameAlreadyUsedError();
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("email")) throw new EmailAlreadyUsedError();
            if (Array.isArray(err.meta?.target) && err.meta.target.includes("phoneNumber")) throw new PhoneNumberAlreadyUsedError();
        }
        if(err.code === "P2025") throw new UserNotFoundError(id);
        throw err;
    }
};

/**
 * Met à jour la date de la dernière connexion de l'utilisateur
 * @param {string} id - identifiant de l'utilisateur
 * @throws {UserNotFoundError} - lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 */
export const updateUserLastLoginDateToNow = async (id: string): Promise<SafeUser> => {
    try {
        const updatedUser = await db.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
        return toSafeUser(updatedUser);
    } catch (err: any) {
        if(err.code === "P2025") throw new UserNotFoundError(id);
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
    try {
        await db.user.delete({ where: { id } });
    } catch (err: any) {
        if(err.code === "P2025") throw new UserNotFoundError(id);
        throw err;
    }
};

/**
 * Récupère toutes les équipes dont un utilisateur est membre
 * @async
 * @param {string} userId - identifiant de l'utilisateur dont on veut récupérer l'équipe
 * @param {SearchTeamssFilter} filter - filtre de recherche à utiliser
 * @returns {Team[]} - la liste d'équipes dont l'utilisateur est membre
 */
export const getUserTeams = async (userId: string, filter: SearchTeamsFilter): Promise<Team[]> => {
    const { page, pageSize,all, ..._ } = filter;
    const userTeamCondition: Prisma.TeamWhereInput = {
        teamUsers: {
            some: { userId }
        }
    };

    const teamFilter = buildTeamWhereInput(filter);

    const query: Prisma.TeamFindManyArgs = {
        where: {
            AND: [userTeamCondition, teamFilter]
        },
        orderBy:{updatedAt:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const userTeams = await db.team.findMany(query);
    return userTeams;
};

/**
 * Récupère tous les projets dan lesquels l'utilisateur est impliqué
 * @param {string} userId - identifiant de l'utilisateur
 * @param {SearchProjectsFilter} filter - filtre de recherche à utiliser
 * @returns {Project[]} - la liste de projets dans lesquels l'utilisateur intervient
 */
export const getUserProjects = async (userId: string, filter: SearchProjectsFilter): Promise<Project[]> => {
    const { page, pageSize,all, ..._ } = filter;
    const userProjectCondition: Prisma.ProjectWhereInput = {
        projectTeams: {
            some: {
                team: {
                    teamUsers: {
                        some: { userId }
                    }
                }
            }
        }
    };

    const projectFilter = buildProjectWhereInput(filter);

    const query: Prisma.ProjectFindManyArgs = {
        where: {
            AND: [userProjectCondition, projectFilter]
        },
        orderBy: { deadline: "desc" }
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const userProjects = await db.project.findMany(query);
    return userProjects;
};

/**
 * Récupère les taches de l'utilisateur
 * @param {string} userId - identifiant de l'utilisateur
 * @param {SearchTasksFilter} filter - filtre de recherche à utiliser
 * @returns {Task[]} - la liste des tâches auxquelles l'utilisateur est assignée
 */
export const getUserTasks = async (userId: string, filter: SearchTasksFilter): Promise<Task[]> => {
    const { page, pageSize,all, ..._ } = filter;
    const userTaskConditions: Prisma.TaskWhereInput = {
        OR: [
            {
                assignedTo: {
                    some: { userId }
                }
            },
            {
                team: {
                    teamUsers: {
                        some: { userId }
                    }
                }
            }
        ]
    };

    const taskfilter = buildTaskWhereInput(filter);
    
    const query: Prisma.TaskFindManyArgs = {
        where: {
            AND: [userTaskConditions, taskfilter]
        },
        orderBy:{deadline:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const userTasks = await db.task.findMany(query);
    return userTasks;
};

/**
 * Récupère toutes les notifications de l'utilisateur ayant l'identifiant donné de la plus recente à la moins
 * @param {string} userId - identifiant de l'utilisateur
 * @param {SearchNotificationsFilter} filter - filtre de recherche à utiliser
 * @return {Notification[]} - la liste des notifications de l'utilisateur 
 */
export const getUserNotifications = async (userId: string, filter:SearchNotificationsFilter): Promise<Notification[]> => {
    const { page, pageSize, all, ..._ } = filter;

    const notificationfilter = buildNotificationWhereInput(filter);
    
    const query: Prisma.NotificationFindManyArgs = {
        where: {
            AND: [{ userId }, notificationfilter]
        },
        orderBy: { createdAt: "desc" }
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }
    const userNotifications = await db.notification.findMany(query);
    return userNotifications;
};

/**
 * Récupère les messages d'un utilisateur
 * @async
 * @param {string} userId - identifiant de l'utilisateur
 * @param {SearchMessagesFilter} filter - filtre de recherche à utiliser
 * @returns {Message[]} - les messages de l'utilisateur
 */
export const getUserMessages = async (userId: string, filter: SearchMessagesFilter): Promise<Message[]> => {
    const { page, pageSize, all, ..._ } = filter;

    const messagefilter = buildMessageWhereInput(filter);
    
    const query: Prisma.MessageFindManyArgs = {
        where: {
            AND: [{ senderId: userId }, messagefilter]
        },
        orderBy: { updatedAt: "desc" }
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }
    const userMessages = await db.message.findMany(query);
    return userMessages;
};

/**
 * Récupère les conversations d'un utilisateur en incluant les participants ainsi que le dernier message 
 * envoyé dans chacune de ces conversations
 * @async
 * @param {string} userId - identifiant de l'utilisateur
 * @param {SearchConversationsFilter} filter - filtre de recherche à utiliser
 * @returns {Conversation[]} - la liste de conversations de l'utilisateur
 */
export const getUserConversations = async (userId: string, filter: SearchConversationsFilter): Promise<Conversation[]> => {
    const { page, pageSize, all, ..._ } = filter;
    const userConversationCondition: Prisma.ConversationWhereInput = {
        participants: {
            some: { userId }
        }
    };

    const conversationFilter = buildConversationWhereInput(filter);
    
    const query: Prisma.ConversationFindManyArgs = {
        where: {
            AND:[userConversationCondition, conversationFilter]
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phoneNumber:true,
                            email: true,
                        }
                    }
                }
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy:{updatedAt:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    const userConversations = await db.conversation.findMany(query);
    return userConversations;
};