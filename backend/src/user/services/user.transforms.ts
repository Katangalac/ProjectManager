import { TokenPayloadType } from '../../auth/types/Auth.js';
import {User, PublicUser, SafeUser} from '../types/User.js'

/**
 * Transforme un objet User en PublicUser
 * Ne conserve que les informations qu'on souhaite exposé publiquement pour un utilisateur
 * @param {User} user : l'objet User contenant les informations de l'utilisateur
 * @returns {PublicUser} : un objet PublicUser contenant les informations de l'utilisateur qu'on souhaite exposées au public
 */
export const toPublicUser = (user: User): PublicUser => {
    return {
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profession: user.profession,
        picture: user.picture,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt
    };
};

/**
 * Transforme un objet User en SafeUser
 * SafeUser conserve toutes les données d'un utilisateur excepté son mot de passe
 * @param {User} user : l'objet User contenant les informations de l'utilisateur
 * @returns {SafeUser} : un objet SafeUser contenant les informations de l'utilisateur excepté le mot de passe
 */
export const toSafeUser = (user: User): SafeUser => {
    const { password, ...safeUser } = user;
    return safeUser;
};

/**
 * Recupère les infrmations necéssaire d'un utilisateur pour construire le payload du token d'authentification
 * @param {SafUser} user : un objet User contenant les informations d'un utilisateur sans donées sensibles
 * @returns {TokenPayloadType} : un objet représentant le payload du token d'authentification
 */
export const toTokenPayload = (user: SafeUser): TokenPayloadType => {
    return {
        sub: user.id,
        email: user.email,
        role: user.role,
        provider: user.provider
    };
};
