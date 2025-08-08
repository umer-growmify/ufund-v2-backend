import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException(
        'AWS configuration is missing. Please check AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in your environment variables.',
      );
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucket) {
      throw new InternalServerErrorException(
        'AWS_S3_BUCKET is not defined in environment variables.',
      );
    }

    const key = `${folder}/${userId}/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      const signedUrl = await this.getSignedUrl(key);
      return { key, url: signedUrl };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file to S3: ${error.message}`,
      );
    }
  }

  async updateFile(
  file: Express.Multer.File,
  key: string, 
): Promise<{ key: string; url: string }> {
  const bucket = this.configService.get<string>('AWS_S3_BUCKET');
  if (!bucket) {
    throw new InternalServerErrorException(
      'AWS_S3_BUCKET is not defined in environment variables.',
    );
  }

  const params = {
    Bucket: bucket,
    Key: key, // same key → will overwrite the existing file
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await this.s3Client.send(new PutObjectCommand(params));
    const signedUrl = await this.getSignedUrl(key);
    return { key, url: signedUrl };
  } catch (error) {
    throw new InternalServerErrorException(
      `Failed to update file in S3: ${error.message}`,
    );
  }
}

  async getSignedUrl(key: string, expiresIn: number = 604800): Promise<string> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucket) {
      throw new InternalServerErrorException(
        'AWS_S3_BUCKET is not defined in environment variables.',
      );
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate signed URL: ${error.message}`,
      );
    }
  }
}