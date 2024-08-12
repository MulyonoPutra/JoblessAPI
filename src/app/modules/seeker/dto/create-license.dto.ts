import { IsNotEmpty } from 'class-validator';

export class CreateLicenseDto {

    @IsNotEmpty()
    seekerId: string;

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    organization: string;

    @IsNotEmpty()
    description: string;

}