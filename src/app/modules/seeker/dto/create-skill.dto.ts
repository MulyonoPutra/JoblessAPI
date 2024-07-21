import { IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    seekerId: string;
}
