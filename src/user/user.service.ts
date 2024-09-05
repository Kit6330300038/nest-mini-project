import { randomBytes } from 'crypto';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema'; // Import UserDocument

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {} // Use UserDocument type

  // create user data
  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(CreateUserDto);
    if (CreateUserDto.usecode.length > 0) {
      var parent = await this.findParent(CreateUserDto.usecode);
      await this.addGain(parent, newUser);
      newUser.descending = parent.descending + 1;
    }
    return await newUser.save();
  }
  async findParent(code: string): Promise<UserDocument> {
    return await this.userModel.findOne({ selfcode: code }).exec();
  }
  async addGain(parentdata: UserDocument, newuser: UserDocument) {
    parentdata.gain += await this.getLot(newuser);
    parentdata.save();
  }

  // เตรียมไว้สำหรับหา user
  async findByUsername(user: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username: user }).exec();
  }
  // Self code
  async getSelfCode(user: string): Promise<string> {
    let userdata = await this.userModel.findOne({ username: user }).exec();
    if (userdata.selfcode.length > 0) {
      return userdata.selfcode;
    }
    let code = this.generateRandomString(16);
    do {
      code = await this.generateRandomString(16);
    } while (await this.isCodeInDatabase(code));
    userdata.selfcode = code;
    userdata.save();
    return userdata.selfcode;
  }

  generateRandomString(length: number): string {
    return randomBytes(length).toString('hex');
  }

  private async isCodeInDatabase(code: string): Promise<boolean> {
    let count = await this.userModel.countDocuments({ selfcode: code });
    return count > 0;
  }

  // Lot
  async lotFromUsername(user: string): Promise<number> {
    let userdata = await this.userModel.findOne({ username: user }).exec();
    return await this.getLot(userdata);
  }

  async getLot(userdata: UserDocument): Promise<number> {
    return Math.max(
      2,
      Math.min(
        30,
        userdata.firstname.length +
          userdata.lastname.length +
          userdata.username.length,
      ),
    );
  }

  async getCommissionMoney(user: string): Promise<number> {
    const descendgain = [5, 3, 2, 1];
    let userdata = await this.userModel.findOne({ username: user }).exec();
    if (userdata.descending < descendgain.length - 1) {
      return userdata.gain * descendgain[userdata.descending + 1];
    }
    return 0;
  }
}
