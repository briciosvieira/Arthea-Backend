import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from '../doctor/doctor.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [ 
    // adicionado por causa do static serve, baseado na doc
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','..','files'),
      serveRoot:'/files'
    }),

    ConfigModule.forRoot( ),
    PrismaModule,
    AuthModule,
    UserModule,
    DoctorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
