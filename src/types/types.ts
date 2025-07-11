import { Role } from "generated/prisma";

export type JwtPayload = {
  id: string;
  roles: Role[];
  activeRole: Role;
};
