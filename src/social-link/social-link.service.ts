import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Injectable()
export class SocialLinkService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSocialLinkDto) {
    return this.prisma.socialLink.create({ data: dto });
  }

  findAll() {
    return this.prisma.socialLink.findMany({ orderBy: { type: 'asc' } });
  }

  async update(id: string, dto: UpdateSocialLinkDto) {
    const record = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Rede social não encontrada.');
    return this.prisma.socialLink.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const record = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Rede social não encontrada.');
    await this.prisma.socialLink.delete({ where: { id } });
    return { message: 'Removido com sucesso.' };
  }
}
