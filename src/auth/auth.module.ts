import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'someSecretData',
      signOptions: {
        expiresIn: 3600
      }
    })
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}
