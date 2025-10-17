import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { BcryptService } from '../auth/hash/bcrypt.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    UserService,
    PrismaService,
       {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  controllers: [UserController]
})
export class UserModule {}
