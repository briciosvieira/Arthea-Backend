import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { PaginationDto } from '../commom/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.create.dto';
import { UpdateUserDto } from './dto/user.update.dto';

@Injectable()
export class UserService {

    constructor(

        private readonly hashingService: HashingServiceProtocol,
        private prismaService: PrismaService
    ) { }


    async save(createDto: CreateUserDto) {

        try {
            const passwordHash = await this.hashingService.hash(createDto.password);

            const user = await this.prismaService.user.create({
                data: {
                    name: createDto.name,
                    login: createDto.login,
                    passwordHash: passwordHash,
                    role: 'USER',
                    active: true
                },
                select: {
                    id: true,
                    name: true,
                    login: true,
                    active: true,
                    createdAt: true,
                }
            });

            if (!user) {
                throw new HttpException('Não foi possível criar o usuário', HttpStatus.BAD_REQUEST);
            }
            return user;

        } catch (error) {
            throw new HttpException("Não foi possível criar o usuário", HttpStatus.BAD_REQUEST);
        }
    }


    async findAll(pagination?: PaginationDto) {
        try {

            const limit = pagination?.limit ? Number(pagination.limit) : undefined;
            const offset = pagination?.offset ? Number(pagination.offset) : undefined;

            const [users, total] = await Promise.all([
                this.prismaService.user.findMany({
                    skip: offset,
                    take: limit,
                    select: {
                        id: true,
                        login: true,
                        name: true,
                        active: true,
                        createdAt: true,
                    },
                }),
                this.prismaService.user.count(),
            ]);

            return {
                users,
                total,
                totalPages: limit ? Math.ceil(total / limit) : 1,
                page: offset && limit ? Math.floor(offset / limit) + 1 : 1,
            };

        } catch (error) {
            throw new HttpException("Ops, algo deu errado", HttpStatus.BAD_REQUEST);
        }
    }

    findOne(id: string) {

        try {
            const user = this.prismaService.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    appointmentsCreated: true
                }
            })

            if (!user) {
                throw new HttpException("Usuário não existe", HttpStatus.NOT_FOUND)
            }

            return user;

        } catch (error) {
            throw new HttpException("Ops, algo deu errado", HttpStatus.BAD_REQUEST)
        }
    }

    async update(id: string, updateDto: UpdateUserDto) {
        try {
            const userId = await this.prismaService.user.findUnique({
                where: { id: id }
            })

            if (!userId) {
                throw new HttpException("Usuário não existe", HttpStatus.NOT_FOUND)
            }

            if (updateDto?.password) {
                const passwordHash = await this.hashingService.hash(updateDto.password);
                updateDto.password = passwordHash;
            }

            const userUpdate = await this.prismaService.user.update({
                where: { id: id },
                data: {
                    name: updateDto.name,
                    login: updateDto.login,
                    active: updateDto.active,
                    passwordHash: updateDto.password
                }
            })
            if (userUpdate) return userUpdate;

        } catch (error) {
            throw new HttpException("Não foi possível atualizar o usuário", HttpStatus.BAD_REQUEST)
        }

    }

    async delete(id: string) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { id: id }
            })

            if (!user) {
                throw new HttpException("Usuario nao encontrado", HttpStatus.NOT_FOUND)
            }

            await this.prismaService.user.delete({
                where: { id: id }
            })

            return {
                message: "usuario deletado"
            }

        } catch (error) {
            throw new HttpException("Falha ao deletar", HttpStatus.BAD_REQUEST)
        }
    }
}
