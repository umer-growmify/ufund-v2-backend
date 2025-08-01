import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileTypeConfig } from 'src/types/types';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private readonly fileConfigs: FileTypeConfig[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Ensure request.files exists
    if (!request.files) {
      request.files = {};
    }

    // Validate each file configuration
    for (const config of this.fileConfigs) {
      const files = request.files[config.fieldName] || [];

      if (config.required) {
        if (!Array.isArray(files) ){
          throw new BadRequestException(
            `Invalid file format for ${config.fieldName}. Expected array of files.`
          );
        }
        if (files.length === 0) {
          throw new BadRequestException(
            `At least one file is required for field '${config.fieldName}'`
          );
        }
      }

      // Validate each file if present
      if (files.length > 0) {
        for (const file of files) {
          if (!file || !file.buffer) {
            throw new BadRequestException(
              `Invalid file upload for ${config.fieldName}`
            );
          }

          if (!config.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
              `File type '${file.mimetype}' is not allowed for ${config.fieldName}. ` +
              `Allowed types: ${config.allowedMimeTypes.join(', ')}`
            );
          }

          if (file.size > config.maxSize) {
            throw new BadRequestException(
              `File '${file.originalname}' (${(file.size / 1024 / 1024).toFixed(2)}MB) ` +
              `exceeds maximum size of ${config.maxSize / 1024 / 1024}MB for ${config.fieldName}`
            );
          }
        }
      }
    }

    return next.handle();
  }
}