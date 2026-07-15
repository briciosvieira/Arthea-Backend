import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SocialLinkController } from './social-link.controller';
import { SocialLinkService } from './social-link.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SocialLinkController],
  providers: [SocialLinkService],
})
export class SocialLinkModule {}
