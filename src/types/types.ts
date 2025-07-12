import { AdminRoleType, RoleType } from "@prisma/client";
import { Request } from "express";
import { Role } from "generated/prisma";


export type JwtPayload = {
  id: string;
  email?: string;
  activeRole: RoleType | AdminRoleType; // Single role
  type: 'user' | 'admin';
};

// export interface RequestWithUser extends Request {
//   user: {
//     id: string;
//     roles: Role[];
//     activeRole: Role;
//   };
// }

export interface RequestWithUser extends Request {
  user: {
    id: string;
    activeRole: RoleType | AdminRoleType; // Changed from roles array
    type: 'user' | 'admin';
  };
}