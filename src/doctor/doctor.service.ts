import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { PaginationDto } from '../commom/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorCreateDto } from './dto/doctor.create.dto';
import { DoctorUpdateDto } from './dto/doctor.update.dto';

@Injectable()
export class DoctorService {

    constructor(private prisma: PrismaService) { }

    async create(doctorCreateDto: DoctorCreateDto, photoUrl: string | undefined) {
        try {
            const doctor = await this.prisma.doctor.create({
                data: {
                    name: doctorCreateDto.name,
                    crm: doctorCreateDto.crm,
                    specialty: doctorCreateDto.specialty,
                    about: doctorCreateDto.about,
                    active: true,
                    photoUrl: photoUrl,
                    hiredAt: new Date()
                }
            })

            if (!doctor) {
                throw new HttpException('Não foi possível criar o usuario, contacte o administrador',
                    HttpStatus.BAD_REQUEST);

            }

            return doctor

        } catch (error) {
            throw new HttpException('Erro no servidor criar o usuario, contacte o administrador',
                HttpStatus.BAD_REQUEST);

        }
    }

    async uploadAvatar(file: Express.Multer.File) {

        try {
            const fileExtension = path.extname(file.originalname).toLowerCase().substring(1)
            const filename = `${randomUUID()}.${fileExtension}`
            const fileLocale = path.resolve(process.cwd(), 'files', filename)

            if (!fileLocale) {
                throw new HttpException('Não foi possível salvar a imagem, verifique se esta em branco',
                    HttpStatus.BAD_REQUEST);

            }

            await fs.writeFile(fileLocale, file.buffer)

            return {
                success: true,
                filename,
                photoUrl: `/files/${filename}`,
            };
        } catch (error) {
            throw new HttpException('Erro no servidor ao salvar a imagem, contacte o administrador',
                HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, doctor: DoctorUpdateDto, photoUrl?: string) {
        try {
            const doctorId = await this.prisma.doctor.findFirst({
                where: {
                    id: id
                }
            });

            if (!doctorId) return "Médico não encontrado";

            // Se houver foto nova, deleta a antiga
            if (photoUrl && doctorId.photoUrl) {
                try {
                    const oldPhotoPath = path.resolve(
                        process.cwd(),
                        doctorId.photoUrl.replace('/files/', 'files/')
                    );
                    await fs.unlink(oldPhotoPath);
                } catch (err) {
                    console.log('Erro ao deletar foto antiga:', err);
                }
            }

            const dataToUpdate: any = {};

            if (doctor.name) dataToUpdate.name = doctor.name;
            if (doctor.crm) dataToUpdate.crm = doctor.crm;
            if (doctor.about !== undefined) dataToUpdate.about = doctor.about;
            if (doctor.active !== undefined) dataToUpdate.active = doctor.active;
            if (doctor.specialty) dataToUpdate.specialty = doctor.specialty;
            if (photoUrl !== undefined) dataToUpdate.photoUrl = photoUrl;

            const update = await this.prisma.doctor.update({
                data: dataToUpdate,
                where: {
                    id: doctorId.id
                }
            });

            return update;
        } catch (error) {
            throw new HttpException(
                'Erro no servidor ao atualizar Médico, contacte o administrador',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async delete(id: string) {
    try {
        const doctor = await this.prisma.doctor.findFirst({
            where: { id }
        });

        if (!doctor) return 'Doutor não encontrado';

        if (doctor.photoUrl) {
            try {
                const photoPath = path.resolve(
                    process.cwd(),
                    doctor.photoUrl.replace('/files/', 'files/')
                );
                await fs.unlink(photoPath);
                console.log('Foto deletada:', photoPath);
            } catch (err) {
                console.log('Erro ao deletar foto (foto pode não existir):', err.message);
            }
        }

        const deleteDoctor = await this.prisma.doctor.delete({
            where: { id: doctor.id }
        });

        return `Doutor ${deleteDoctor.name} de CRM: ${deleteDoctor.crm} deletado com sucesso`;
    } catch (error) {
        console.error('Erro real:', error); 
        throw new HttpException(
            'Erro no servidor ao deletar Médico, contacte o administrador',
            HttpStatus.BAD_REQUEST
        );
    }
}


    async findAll(pagination?: PaginationDto) {
        try {
            const limit = pagination?.limit ? Number(pagination.limit) : undefined;
            const offset = pagination?.offset ? Number(pagination.offset) : undefined;

            const [doctors, total] = await Promise.all([
                this.prisma.doctor.findMany({
                    skip: offset,
                    take: limit,
                    select: doctorSelect,
                    orderBy: { name: 'asc' },
                }),
                this.prisma.doctor.count(),
            ]);

            return {
                doctor: doctors,
                total,
                totalPages: limit ? Math.ceil(total / limit) : 1,
                page: offset && limit ? Math.floor(offset / limit) + 1 : 1,
            };
        } catch (error) {
            throw new HttpException('Ops, algo deu errado', HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        const doctor = await this.prisma.doctor.findFirst({
            where: { id },
            select: doctorSelect,
        });

        if (!doctor) {
            throw new HttpException('Médico não encontrado', HttpStatus.NOT_FOUND);
        }

        return doctor;
    }
}

const doctorSelect = {
    id: true,
    name: true,
    crm: true,
    specialty: true,
    about: true,
    photoUrl: true,
    active: true,
    hiredAt: true,
    createdAt: true,
    updatedAt: true,
} as const;
