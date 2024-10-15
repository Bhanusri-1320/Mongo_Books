import { ApiProperty } from '@nestjs/swagger';

export class UserCredentialsDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
