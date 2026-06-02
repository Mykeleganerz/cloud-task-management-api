/**
 * User Entity
 * Represents the user model mapped from Prisma schema
 */
export class User {
    id: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
