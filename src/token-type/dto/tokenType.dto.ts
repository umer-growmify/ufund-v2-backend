import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenTypeDto{
    @IsNotEmpty()
    @IsString()
    name: string
}