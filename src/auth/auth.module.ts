import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        console.log('JWT Secret:', jwtSecret); // Debug output
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '60m' },
        };
      },
      inject: [ConfigService], // Inject ConfigService
    }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
