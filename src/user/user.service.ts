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
  private readonly descendgain: number[] = [5, 3, 2, 1];

  // create user data
  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(CreateUserDto);
    if (CreateUserDto.usecode.length > 0) {
      //var parent = await this.findParent(CreateUserDto.usecode);
    }
    return await newUser.save();
  }
  // async findParent(code: string): Promise<UserDocument> {
  //   return await this.userModel.findOne({ selfcode: code }).exec();
  // }

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

  // commission money
  async getCommissionMoney(user: string): Promise<number> {
    let userdata = await this.userModel.findOne({ username: user }).exec();
    if (userdata.selfcode.length > 0) {
      return await this.addCommissionbyChild(
        0,
        await this.findChild(userdata.selfcode),
      );
    }
    return 0;
  }

  async addCommissionbyChild(
    Level: number,
    child: UserDocument[],
  ): Promise<number> {
    //const descendgain = [5, 3, 2, 1];
    let money = 0;
    let lot = 0;
    if (this.descendgain.length <= Level) {
      return 0;
    }
    for (const element of child) {
      // sum lot from all child
      lot += await this.getLot(element);
      if (element.selfcode.length > 0) {
        // have child have code (maybe have child)
        money += await this.addCommissionbyChild(
          Level + 1,
          await this.findChild(element.selfcode),
        );
      }
    }
    return money + lot * this.descendgain[Level];
  }

  async findChild(code: string): Promise<UserDocument[]> {
    return await this.userModel.find({ usecode: code }).exec();
  }
}
