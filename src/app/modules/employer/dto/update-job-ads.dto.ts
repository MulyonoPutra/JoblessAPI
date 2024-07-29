import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateJobAdStatusDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['open', 'expired', 'closed'])
    status: string;

}