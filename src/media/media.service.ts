import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HeroType, SliderSection } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSliderDto } from './dto/update-slider.dto';

const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Hero ────────────────────────────────────────────────────────────────────

  async getHero() {
    const hero = await this.prisma.heroMedia.findFirst();
    if (hero) return hero;
    return this.prisma.heroMedia.create({ data: { type: HeroType.VIDEO } });
  }

  async updateHeroType(type: HeroType) {
    const hero = await this.getHero();
    return this.prisma.heroMedia.update({
      where: { id: hero.id },
      data: { type },
    });
  }

  async uploadHeroVideo(file: Express.Multer.File) {
    const allowedVideoMimes = ['video/mp4', 'video/quicktime'];
    if (!allowedVideoMimes.includes(file.mimetype)) {
      throw new BadRequestException('Apenas arquivos MP4 ou MOV são aceitos.');
    }
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    const filename = `${randomUUID()}${ext}`;
    const dest = path.join(UPLOADS_ROOT, 'hero', filename);

    await fs.writeFile(dest, file.buffer);

    const filePath = `/uploads/hero/${filename}`;
    const hero = await this.getHero();

    if (hero.videoPath) {
      await this.deleteFile(hero.videoPath);
    }

    return this.prisma.heroMedia.update({
      where: { id: hero.id },
      data: { videoPath: filePath },
    });
  }

  async uploadHeroImage(file: Express.Multer.File) {
    this.validateImageMime(file);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const dest = path.join(UPLOADS_ROOT, 'hero', filename);

    await fs.writeFile(dest, file.buffer);

    const filePath = `/uploads/hero/${filename}`;
    const hero = await this.getHero();

    if (hero.imagePath) {
      await this.deleteFile(hero.imagePath);
    }

    return this.prisma.heroMedia.update({
      where: { id: hero.id },
      data: { imagePath: filePath },
    });
  }

  // ─── Sliders ─────────────────────────────────────────────────────────────────

  async getSliderImages(section: SliderSection) {
    return this.prisma.sliderImage.findMany({
      where: { section },
      orderBy: { order: 'asc' },
    });
  }

  async addSliderImage(section: SliderSection, file: Express.Multer.File) {
    this.validateImageMime(file);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const dest = path.join(UPLOADS_ROOT, 'sliders', filename);

    await fs.writeFile(dest, file.buffer);

    const maxOrder = await this.prisma.sliderImage.aggregate({
      where: { section },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.sliderImage.create({
      data: {
        section,
        filePath: `/uploads/sliders/${filename}`,
        order: nextOrder,
      },
    });
  }

  async updateSliderImage(
    section: SliderSection,
    id: string,
    dto: UpdateSliderDto,
  ) {
    await this.findSliderOrFail(section, id);
    return this.prisma.sliderImage.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSliderImage(section: SliderSection, id: string) {
    const record = await this.findSliderOrFail(section, id);
    await this.deleteFile(record.filePath);
    await this.prisma.sliderImage.delete({ where: { id } });
    return { message: 'Imagem removida com sucesso.' };
  }

  // ─── Quem Somos ──────────────────────────────────────────────────────────────

  async getQuemSomos() {
    return this.prisma.quemSomosImage.findMany({ orderBy: { position: 'asc' } });
  }

  async upsertQuemSomos(position: number, file: Express.Multer.File) {
    if (position !== 1 && position !== 2) {
      throw new BadRequestException('Position deve ser 1 ou 2.');
    }
    this.validateImageMime(file);

    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const dest = path.join(UPLOADS_ROOT, 'quem-somos', filename);

    await fs.writeFile(dest, file.buffer);

    const filePath = `/uploads/quem-somos/${filename}`;

    const existing = await this.prisma.quemSomosImage.findUnique({
      where: { position },
    });

    if (existing) {
      await this.deleteFile(existing.filePath);
      return this.prisma.quemSomosImage.update({
        where: { position },
        data: { filePath },
      });
    }

    return this.prisma.quemSomosImage.create({ data: { position, filePath } });
  }

  async deleteQuemSomos(position: number) {
    if (position !== 1 && position !== 2) {
      throw new BadRequestException('Position deve ser 1 ou 2.');
    }
    const record = await this.prisma.quemSomosImage.findUnique({
      where: { position },
    });
    if (!record) throw new NotFoundException('Imagem não encontrada.');
    await this.deleteFile(record.filePath);
    await this.prisma.quemSomosImage.delete({ where: { position } });
    return { message: 'Imagem removida com sucesso.' };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private validateImageMime(file: Express.Multer.File) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        'Apenas imagens JPEG, PNG ou WebP são aceitas.',
      );
    }
  }

  private async findSliderOrFail(section: SliderSection, id: string) {
    const record = await this.prisma.sliderImage.findFirst({
      where: { id, section },
    });
    if (!record) throw new NotFoundException('Imagem do slider não encontrada.');
    return record;
  }

  private async deleteFile(filePath: string) {
    try {
      const abs = path.resolve(
        process.cwd(),
        filePath.replace(/^\//, ''),
      );
      await fs.unlink(abs);
    } catch {
      // ignora se o arquivo já não existe
    }
  }
}
