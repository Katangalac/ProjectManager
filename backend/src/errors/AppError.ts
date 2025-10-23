/**
 * Classe d'exception de base de l'application
 */
export class AppError extends Error {
    status: number
    code?: string | undefined

    constructor(message:string, status:number = 500, code?:string) {
        super(message);
        this.status = status;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}