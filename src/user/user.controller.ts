import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async Register(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    const user = this.userService.findByUsername(req.user.username);
    return user;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('getcode')
  async getCode(@Request() req) {
    const user = this.userService.getSelfCode(req.user.username);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('myLot')
  async getLot(@Request() req) {
    const user = this.userService.lotFromUsername(req.user.username);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('myCommission')
  async getCommission(@Request() req) {
    const user = this.userService.getCommissionMoney(req.user.username);
    return user;
  }
}
