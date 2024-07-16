import { HttpCode, HttpStatus, UseGuards, applyDecorators } from '@nestjs/common';

import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Role } from 'src/app/modules/auth/enums/role.enum';
import { Roles } from 'src/app/common/decorators';

export function EmployerDecorator() {
	return applyDecorators(
		Roles(Role.EMPLOYER),
		HttpCode(HttpStatus.OK),
		UseGuards(AuthenticationGuard, AuthorizationGuard),
	);
}
