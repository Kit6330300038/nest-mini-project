import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    //const jwtSecret = this.configService.get<string>('JWT_SECRET');
    //console.log('JWT Secret:', jwtSecret); // Debugging log to check secret
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
