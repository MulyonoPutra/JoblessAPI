import { Role } from 'src/app/modules/auth/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);
