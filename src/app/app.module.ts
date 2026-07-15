import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AuthModule } from '../auth/auth.module';
import { DoctorModule } from '../doctor/doctor.module';
import { MediaModule } from '../media/media.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SocialLinkModule } from '../social-link/social-link.module';
import { SpecialtyModule } from '../specialty/specialty.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', '..', 'files'),
        serveRoot: '/files',
      },
      {
        rootPath: join(__dirname, '..', '..', 'uploads'),
        serveRoot: '/uploads',
      },
    ),
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    DoctorModule,
    MediaModule,
    SpecialtyModule,
    SocialLinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
