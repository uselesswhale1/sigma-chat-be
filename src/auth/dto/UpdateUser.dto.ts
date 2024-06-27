import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserDto {
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;

  @IsOptional()
  @MaxLength(32)
  firstName?: string;

  @IsOptional()
  @MaxLength(32)
  lastName?: string;

  @IsOptional()
  @MaxLength(32)
  bio?: string;

  @IsOptional()
  @MaxLength(32)
  photoUrl?: string;
}
