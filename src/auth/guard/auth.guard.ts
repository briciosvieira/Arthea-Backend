import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import * as config from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import jwtConfig from "../config/jwt.config";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { REQUEST_TOKEN_PAYLOAD } from "../params/auth-constants";
import { Request } from 'express';

export class AuthGuard implements CanActivate {

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
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token,
                this.jwtConfiguration)
            request[REQUEST_TOKEN_PAYLOAD] = payload;

            const user = this.prismaService.user.findFirst({
                where: {
                    id: payload?.sub,
                    active: true
                }
            })

            if (!user) {
                throw new UnauthorizedException('Usuário inválido ou inativo');
            }

            request.user = await user;
            return true
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }


    }


    extractToken(request: Request) {
        if (request.cookies && request.cookies['token']) {
            return request.cookies['token'];
        }
        const authorization = request.headers['authorization'];
        if (!authorization || typeof authorization !== "string") {
           
            return;
        }
        return authorization.split(' ')[1];
    }
}