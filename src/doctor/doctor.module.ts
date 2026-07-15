import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
