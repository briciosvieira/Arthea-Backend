import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import jwtConfig from './config/jwt.config';
import { SingInDto } from './dto/singin.dto';
import { HashingServiceProtocol } from './hash/hashing.service';


@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService,
        private readonly hashService: HashingServiceProtocol,
        

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ) { }


    async authenticate(singInDto: SingInDto) {

        const user = await this.prismaService.user.findFirst({
            where: {
                login: singInDto.login,
                active: true
            }
        })

        if (!user) {
            throw new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED);
        }

        const passwordValid = await this.hashService.compare(
            singInDto.password,
            user.passwordHash
        )

        if (!passwordValid) {
            throw new HttpException('Senha inválida', HttpStatus.UNAUTHORIZED);
        }

        const token = await this.jwtService.signAsync(
            {
                sub: user.id,
                name: user.name,
            },
            {
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer
            }
        );

        return { token: token };
    }
}
