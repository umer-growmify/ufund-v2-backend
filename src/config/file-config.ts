import { FileTypeConfig } from 'src/types/types';

// src/config/file-config.ts
export const productFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'auditorsReport',
    allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg','image/jpg'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
  },
  {
    fieldName: 'document',
    allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg','image/jpg'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'tokenImage',
    allowedMimeTypes: ['image/png', 'image/jpeg','image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'assetImage',
    allowedMimeTypes: ['image/png', 'image/jpeg','image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'imageOne',
    allowedMimeTypes: ['image/png', 'image/jpeg','image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageTwo',
    allowedMimeTypes: ['image/png', 'image/jpeg','image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
];

export const prfileFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'image',
    required: false,
    allowedMimeTypes: ['image/jpeg', 'image/png','image/jpg'],
    maxSize: 5 * 1024 * 1024,
  },
];

export const categoryFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'image',
    required: false,
    allowedMimeTypes: ['image/jpeg', 'image/png','image/jpg'],
    maxSize: 5 * 1024 * 1024,
  },
];

