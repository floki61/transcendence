import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { retry } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
			  private prima: PrismaService) {}

  async canActivate(context: ExecutionContext) {
	const roles = this.reflector.get<string[]>('roles', context.getHandler());
	if (!roles) {
	  return true;
	}
	const request = context.switchToHttp().getRequest();
	const body = request.body;
	const user = request.user;
	const participant = await this.prima.participant.findUnique({
		where: {
			uid_rid: {
				uid: user.id,
				rid: body.rid,
			}
		}
	});
	const userType = participant.role;
	console.log('userType', userType);
	if(!roles.some(r => r === userType))
		throw new ForbiddenException('Forbidden');
	return true;
  }
}