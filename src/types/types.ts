import { AdminRoleType, RoleType } from "@prisma/client";
import { Request } from "express";


export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'user' | 'admin';
  iat?: number;
  exp?: number;
}


export interface RequestWithUser extends Request {
  user: {
    id: string;
    activeRole: RoleType | AdminRoleType; // Changed from roles array
    type: 'user' | 'admin';
  };
}

export interface FileTypeConfig {
  allowedMimeTypes: string[];
  maxSize: number;
  fieldName: string;
  required?: boolean; 
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: RoleType | AdminRoleType;
  type: 'user' | 'admin';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface CookieTokens {
  accessToken: string;
  refreshToken: string;
  isAdmin: boolean;
}