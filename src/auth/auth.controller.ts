/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/userCredentials.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('signup')
  @Post('signup')
  createUser(@Body() userCredentials: UserCredentialsDto): Promise<User> {
    return this.authService.signup(userCredentials);
  }

  @ApiTags('signin')
  @Post('signin')
  singin(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signin(userCredentialsDto);
  }
}
