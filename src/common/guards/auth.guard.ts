import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    let token = request.cookies?.['access_token'];

    if (!token) {
      token = request.headers?.authorization?.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException('Token topilmadi!');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Noto‘g‘ri yoki eskirgan token!');
    }
  }
}
