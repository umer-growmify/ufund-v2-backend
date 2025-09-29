import { FileTypeConfig } from 'src/types/types';

// src/config/file-config.ts
export const productFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'auditorsReport',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
  },
  {
    fieldName: 'document',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'tokenImage',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'assetImage',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'imageOne',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageTwo',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
];

export const prfileFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'image',
    required: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxSize: 5 * 1024 * 1024,
  },
];

export const categoryFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'image',
    required: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxSize: 5 * 1024 * 1024,
  },
];

export const editCategoryFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'image',
    required: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxSize: 5 * 1024 * 1024,
  },
];

export const assetsFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'auditorsReportKey',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
  },
  {
    fieldName: 'documentKey',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'productImageKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'assetImageKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
  },
  {
    fieldName: 'imageOneKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageTwoKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
];

export const editProductFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'auditorsReport',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'document',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'tokenImage',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'assetImage',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageOne',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageTwo',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
];

export const editAssetFileConfig: FileTypeConfig[] = [
  {
    fieldName: 'auditorsReportKey',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'documentKey',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  },
  {
    fieldName: 'productImageKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'assetImageKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageOneKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
  {
    fieldName: 'imageTwoKey',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    required: false,
  },
];
