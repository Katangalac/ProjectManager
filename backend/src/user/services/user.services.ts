import { User, SafeUser, RegisterUserInput, UpdateUserInput, GetUsersFilters } from "../types/User.js"
import { toSafeUser } from "./user.transforms.js";
import{EmailAlreadyUsedError,PhoneNumberAlreadyUsedError,UserAlreadyExistError,UserNotFoundError,UsernameAlreadyUsedError} from "../errors/index.js"
import { Prisma, UserRole, UserProvider } from "@prisma/client";
import { db } from "../../db.js";
import { hash } from "argon2";


/**
 * Crée et enregistre un nouvel utilisateur dans le système
 * @async
 * @param {RegisterUserInput} newUserData : les informations nécessaires pour la création d'un utilisateur
 * @param {UserProvider} provider : la source de provenance de l'utilsateur ( ex:google,facebook,local ou autres)
 * @param {string|null} oauthId: identifiant unique de l'utilisateur provenant d'un service 0Auth le cas echéant
 * @returns {SafeUser} : l'utilisateur créé 
 * @throws {EmailAlreadyUsedError} : lorsque l'email est déjà utilisé par un autre utilisateur
 * @throws {UsernameAlreadyUsedError} : lorsque le nom d'utilisateur est déjà utilisé par un autre utilisateur
 * @throws {UserAlreadyExistError} : lorsque l'utilisateur est déjà enregistré dans le système
 */
export const createUser = async (newUserData: RegisterUserInput, provider: UserProvider = UserProvider.LOCAL, oauthId:string|null = null): Promise<SafeUser> => {
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
 * Fait une recherche des utilisateurs enregistrés en appliquant les filtres transmis
 * @async
 * @param {GetUsersFilters} filters : les filtres à utiliser sur la liste des utilisateurs
 * @returns {Promise<SafeUser[]>} : la liste des utilisateurs respectant les filtres utilisés
 */
export const getUsers = async (filters: GetUsersFilters): Promise<SafeUser[]> => {
    const { page, pageSize, ...input } = filters;
    const where: Prisma.UserWhereInput = {};
    if (input.email) where.email = { contains: input.email, mode: 'insensitive' };
    if (input.userName) where.userName = { contains: input.userName, mode: 'insensitive' };
    if (input.firstName) where.firstName = { contains: input.firstName, mode: 'insensitive' };
    if (input.lastName) where.lastName = { contains: input.lastName, mode: 'insensitive' };
    if (input.profession) where.profession = { contains: input.profession, mode: 'insensitive' };
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
 * @param {string} id : l'identifiant de l'utilisateur recherché
 * @returns {Promise<SafeUser>} : l'utilisateur ayant l'identifiant passé en paramètre
 * @throws {UserNotFoundError} : lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 */
export const getUserById = async (id: string): Promise<SafeUser> => {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundError(id);
    return toSafeUser(user);
};

/**
 * Met à jour les informations d'un utilisateur
 * @async
 * @param {string} id : l'identifiant de l'utilisateur
 * @param {UpdateUserInput} userData : les données à mettre à jour
 * @returns {Promise<SafeUser>} : l'utilisateur avec les informations à jour 
 * @throws {UserNotFoundError} : lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 * @throws {EmailAlreadyUsedError} : lorsque l'email est déjà utilisé par un autre utilisateur
 * @throws {UsernameAlreadyUsedError} : lorsque le nom d'utilisateur est déjà utilisé par un autre utilisateur
 * @throws {PhoneNumberAlreadyUsedError} : lorsque le numéro de téléphone est déjà utilisé par un autre utilisateur
 */
export const updateUser = async (id: string, userData: UpdateUserInput): Promise<SafeUser> => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) throw new UserNotFoundError(id);
        const cleanedData = Object.fromEntries(
            Object.entries(userData).filter(([_, v]) => v !== undefined)
        );

        /**const cleanedData: Prisma.UserUpdateInput = {
            updatedAt: new Date(),
        };
  
        if ("userName" in updateData && updateData.userName !== undefined) prismaData.userName = updateData.userName;
        if ("email" in updateData && updateData.email !== undefined) prismaData.email = updateData.email;
        if ("firstName" in updateData && updateData.firstName !== undefined) prismaData.firstName = updateData.firstName;
        if ("lastName" in updateData && updateData.lastName !== undefined) prismaData.lastName = updateData.lastName;
        if ("phoneNumber" in updateData && updateData.phoneNumber !== undefined) prismaData.phoneNumber = updateData.phoneNumber;
        if ("profession" in updateData && updateData.profession !== undefined) prismaData.profession = updateData.profession;
        if ("picture" in updateData && updateData.picture !== undefined) prismaData.picture = updateData.picture;
        if ("imageUrl" in updateData && updateData.imageUrl !== undefined) prismaData.imageUrl = updateData.imageUrl;*/

        const updatedUser = await db.user.update({
            where: { id },
            data: cleanedData as Prisma.UserUpdateInput
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
 * @param {string} id : l'identifiant de l'utilisateur à supprimer
 * @throws {UserNotFoundError} : lorsqu'aucun utilisateur avec l'identifiant n'est trouvé
 */
export const deleteUser = async (id: string): Promise<void> => {
    const user = await db.user.findUnique({ where: { id:id } });
    if (!user) throw new UserNotFoundError(id);
    await db.user.delete({ where: { id } });
};

