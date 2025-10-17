import { Role } from "../../auth/role/roles.enum";

export class User {
    id: string;
    login: string;
    name: string;
    passwordHash: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: Role
}