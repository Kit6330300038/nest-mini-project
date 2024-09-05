import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), // Initialize ConfigModule
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigModule available
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),

        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService], // Inject ConfigService to use it in useFactory
    }), // user: configService.get<string>('MONGODB_USER'),
    // pass: configService.get<string>('MONGODB_PASS'),authSource: configService.get<string>('MONGODB_AUTH'),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
  //exports: [JwtStrategy, JwtModule],
})
export class AppModule {}
