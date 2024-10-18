import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { UserCredentialsDto } from './dto/userCredentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(userCredentialsDto: UserCredentialsDto): Promise<User> {
    const { username, password } = userCredentialsDto;
    const found = await this.userModel.findOne({ username });
    if (!found) {
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(password, salt);
      const user = await this.userModel.create({
        username,
        password: hashedpassword,
      });
      return user;
    } else {
      throw new ConflictException(
        `user alreay exists with name of ${username}`,
      );
    }
  }
  async signin(
    userCredentials: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = userCredentials;
    const user = await this.userModel.findOne({ username });
    console.log(`User ${username} attempted to sign in.`);

    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (passwordMatches) {
        const payload: JwtPayload = { username };
        const accessToken: string = await this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new UnauthorizedException(
          'Invalid credentials: incorrect password.',
        );
      }
    } else {
      throw new UnauthorizedException('Invalid credentials: user not found.');
    }
  }
}
