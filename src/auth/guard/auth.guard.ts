import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as config from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import jwtConfig from "../config/jwt.config";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { REQUEST_TOKEN_PAYLOAD } from "../params/auth-constants";
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

    private static readonly userCache = new Map<string, { user: any; expiresAt: number }>();
    private static readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, this.jwtConfiguration);
            request[REQUEST_TOKEN_PAYLOAD] = payload;

            const now = Date.now();
            const cached = AuthGuard.userCache.get(payload.sub);

            if (cached && cached.expiresAt > now) {
                request.user = cached.user;
                return true;
            }

            const user = await this.prismaService.user.findFirst({
                where: { id: payload.sub, active: true },
                select: { id: true, name: true, login: true, role: true, active: true },
            });

            if (!user) {
                throw new UnauthorizedException('Usuário inválido ou inativo');
            }

            AuthGuard.userCache.set(payload.sub, { user, expiresAt: now + AuthGuard.CACHE_TTL_MS });

            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }

    static clearUserCache(userId: string) {
        AuthGuard.userCache.delete(userId);
    }

    extractToken(request: Request) {
        if (request.cookies && request.cookies['token']) {
            return request.cookies['token'];
        }
        const authorization = request.headers['authorization'];
        if (!authorization || typeof authorization !== 'string') {
            return;
        }
        return authorization.split(' ')[1];
    }
}