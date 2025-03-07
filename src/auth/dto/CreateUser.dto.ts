import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;

  @MaxLength(32)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}
