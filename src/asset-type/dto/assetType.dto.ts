import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetTypeDto{
    @IsNotEmpty()
    @IsString()
    name: string
}