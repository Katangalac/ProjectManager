import {User, PublicUser, SafeUser} from '../types/User.js'

/**
 * Transforme un objet User en PublicUser
 * Ne conserve que les informations qu'on souhaite exposé publiquement pour un utilisateur
 * @param user : l'objet User contenant les informations de l'utilisateur
 * @returns : un objet PublicUser contenant les informations de l'utilisateur qu'on souhaite exposées au public
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
 * @param user : l'objet User contenant les informations de l'utilisateur
 * @returns : un objet SafeUser contenant les informations de l'utilisateur excepté le mot de passe
 */
export const toSafeUser = (user: User): SafeUser => {
    const { password, ...safeUser } = user;
    return safeUser;
};
