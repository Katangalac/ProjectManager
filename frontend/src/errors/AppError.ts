/**
 * Classe d'exception de base de l'application
 */
export class AppError extends Error {
  code: string | undefined;

  constructor(message: string, code: string = "UNKNOWN_ERROR") {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
