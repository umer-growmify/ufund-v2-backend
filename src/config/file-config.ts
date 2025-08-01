import { FileTypeConfig } from 'src/types/types';

// src/config/file-config.ts
export const productFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'auditorsReport',
    allowedMimeTypes: ['application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
  },
  {
    fieldName: 'document',
    allowedMimeTypes: ['application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'tokenImage',
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'assetImage',
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'imageOne',
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageTwo',
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
];

export const prfileFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'image',
    required: false,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    maxSize: 5 * 1024 * 1024,
  },
];
