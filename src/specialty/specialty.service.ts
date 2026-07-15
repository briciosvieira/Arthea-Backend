import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpecialtyDto) {
    const exists = await this.prisma.specialty.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException('Especialidade já cadastrada.');

    return this.prisma.specialty.create({ data: dto });
  }

  findAll() {
    return this.prisma.specialty.findMany({ orderBy: { name: 'asc' } });
  }

  async remove(id: string) {
    const record = await this.prisma.specialty.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Especialidade não encontrada.');
    await this.prisma.specialty.delete({ where: { id } });
    return { message: 'Especialidade removida com sucesso.' };
  }
}
